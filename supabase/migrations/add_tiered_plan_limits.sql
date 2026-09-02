-- Migration: Kembalikan fungsi claim_stamp_token kepada Pelan Percuma (20 Pelanggan) & Pelan Pro (Unlimited)

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

    -- 6. Enforce Free Tier 20-Customer Limit for NEW customers
    -- If store is NOT on active Pro plan, check if adding a new customer exceeds 20
    if not v_is_existing_customer and (coalesce(v_store_row.plan_type, 'free') != 'pro' or coalesce(v_store_row.subscription_status, 'active') != 'active') then
        select count(*) into v_customer_count
        from public.customer_loyalty
        where store_id = v_token_row.store_id;

        if v_customer_count >= 20 then
            return jsonb_build_object(
                'success', false,
                'error', 'customer_limit_reached',
                'message', 'Kedai ini telah mencapai had maksimum 20 pelanggan bagi Pelan Percuma. Sila hubungi peniaga untuk menaik taraf ke Pelan Pro.'
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
