-- Migration: Tambah sokongan Top-Up Kad Digital (One-Off / Sekali Bayar)
-- 1 Kad = RM0.50 (Minimum 35 Kad = RM17.50)
-- Had Pelanggan = 20 Asas Percuma + purchased_card_quota

-- 1. Tambah kolum purchased_card_quota pada table stores jika belum wujud
alter table public.stores add column if not exists purchased_card_quota int not null default 0;

-- 2. Fungsi atomic untuk menambah kuota kad yang dibeli melalui Stripe Webhook
create or replace function public.add_purchased_card_quota(p_store_id uuid, p_count int)
returns void as $$
begin
    update public.stores
    set purchased_card_quota = coalesce(purchased_card_quota, 0) + p_count,
        updated_at = now()
    where id = p_store_id;
end;
$$ language plpgsql security definer
set search_path = public, pg_temp;

-- 3. Kemas kini fungsi claim_stamp_token untuk mengira had kapasiti dinamik (20 Asas + purchased_card_quota)
create or replace function public.claim_stamp_token(p_token text)
returns jsonb as $$
declare
    v_customer_id uuid;
    v_token_row public.stamp_tokens%ROWTYPE;
    v_store_row public.stores%ROWTYPE;
    v_prev_stamps int := 0;
    v_new_stamps int := 0;
    v_is_existing_customer boolean := false;
    v_customer_count int := 0;
    v_store_plan text;
    v_store_sub_status text;
    v_purchased_quota int := 0;
    v_max_allowed int := 20;
begin
    -- 1. Check authenticated user
    v_customer_id := auth.uid();
    if v_customer_id is null then
        return jsonb_build_object(
            'success', false,
            'error', 'unauthenticated',
            'message', 'Sila log masuk untuk menebus cop stamp.'
        );
    end if;

    -- 2. Lock & fetch token (#1 Token Single-Use Enforcement: FOR UPDATE row lock)
    select * into v_token_row
    from public.stamp_tokens
    where token = p_token
    for update;

    if not found then
        return jsonb_build_object(
            'success', false,
            'error', 'not_found',
            'message', 'Pautan cop ini tidak sah atau tidak wujud.'
        );
    end if;

    -- 3. Validate token status
    if v_token_row.status = 'claimed' then
        return jsonb_build_object(
            'success', false,
            'error', 'already_claimed',
            'message', 'Cop ini sudah diambil sebelum ini.'
        );
    end if;

    if v_token_row.expires_at < now() or v_token_row.status = 'expired' then
        update public.stamp_tokens
        set status = 'expired'
        where id = v_token_row.id;

        return jsonb_build_object(
            'success', false,
            'error', 'expired',
            'message', 'Pautan ini telah luput tempoh (sah 30 minit sahaja).'
        );
    end if;

    -- 4. Get & lock store information
    select * into v_store_row
    from public.stores
    where id = v_token_row.store_id
    for update;

    -- 5. Check customer loyalty status (is this customer already registered for this store?)
    select coalesce(total_stamps, 0) into v_prev_stamps
    from public.customer_loyalty
    where customer_id = v_customer_id
      and store_id = v_token_row.store_id;

    if v_prev_stamps is not null and v_prev_stamps > 0 then
        v_is_existing_customer := true;
    else
        select exists(
            select 1 from public.customer_loyalty
            where customer_id = v_customer_id and store_id = v_token_row.store_id
        ) into v_is_existing_customer;

        if v_prev_stamps is null then
            v_prev_stamps := 0;
        end if;
    end if;

    -- 6. Enforce Dynamic Customer Capacity for NEW customers
    -- Pro Active = Unlimited (-1)
    -- Non-Pro (Free / Top-Up) = 20 Asas Percuma + purchased_card_quota
    v_store_plan := coalesce(v_store_row.plan_type, 'free');
    v_store_sub_status := coalesce(v_store_row.subscription_status, 'active');
    v_purchased_quota := coalesce(v_store_row.purchased_card_quota, 0);
    v_max_allowed := 20 + v_purchased_quota;

    if v_store_sub_status = 'active' and v_store_plan = 'pro' then
        v_max_allowed := -1; -- Unlimited
    end if;

    if not v_is_existing_customer and v_max_allowed > 0 then
        select count(*) into v_customer_count
        from public.customer_loyalty
        where store_id = v_token_row.store_id;

        if v_customer_count >= v_max_allowed then
            return jsonb_build_object(
                'success', false,
                'error', 'customer_limit_reached',
                'message', format('Kedai ini telah mencapai had kapasiti %s pelanggan. Sila tambah kuota kad digital atau langgan Pelan Pro.', v_max_allowed)
            );
        end if;
    end if;

    v_new_stamps := v_prev_stamps + v_token_row.stamp_count;

    -- 7. Mark token as claimed (#1 Single-Use Enforcement: atomic state update)
    update public.stamp_tokens
    set
        status = 'claimed',
        claimed_by = v_customer_id,
        claimed_at = now()
    where id = v_token_row.id;

    -- 8. Upsert customer loyalty balance
    insert into public.customer_loyalty (customer_id, store_id, total_stamps, updated_at)
    values (v_customer_id, v_token_row.store_id, v_new_stamps, now())
    on conflict (customer_id, store_id)
    do update set
        total_stamps = public.customer_loyalty.total_stamps + v_token_row.stamp_count,
        updated_at = now();

    -- 9. Return comprehensive payload for frontend animations
    return jsonb_build_object(
        'success', true,
        'storeId', v_token_row.store_id,
        'stampsAdded', v_token_row.stamp_count,
        'previousStamps', v_prev_stamps,
        'newTotal', v_new_stamps,
        'storeName', coalesce(v_store_row.name, 'Kedai'),
        'stampsRequired', coalesce(v_store_row.stamps_required, 10),
        'rewardDescription', coalesce(v_store_row.reward_description, '1 ganjaran istimewa')
    );
end;
$$ language plpgsql security definer
set search_path = public, pg_temp;
