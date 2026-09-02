-- Migration: Kemaskini RPC claim_stamp_token untuk menyokong had bertingkat (Tiered Customer Limits)
-- Pelan Percuma: 20 Pelanggan
-- Pelan Starter (RM15/bln): 50 Pelanggan (20 Percuma + 30 Starter)
-- Pelan Growth (RM35/bln): 120 Pelanggan (20 Percuma + 100 Growth)
-- Pelan Pro (RM53/bln / RM616/thn): Tanpa Had Pelanggan (Unlimited)

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
    v_store_plan text := 'free';
    v_store_sub_status text := 'active';
    v_max_allowed int := 20;
begin
    -- 1. Semak pengguna yang disahkan
    v_customer_id := auth.uid();
    if v_customer_id is null then
        return jsonb_build_object(
            'success', false,
            'error', 'unauthenticated',
            'message', 'Sila log masuk untuk menebus cop stamp.'
        );
    end if;

    -- 2. Kunci & dapatkan maklumat token
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

    -- 3. Sahkan status token
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

    -- 4. Dapatkan & kunci maklumat kedai
    select * into v_store_row
    from public.stores
    where id = v_token_row.store_id
    for update;

    -- 5. Semak status kesetiaan pelanggan
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

    -- 6. Had Limit Pelanggan mengikut Pelan Langganan (Hanya untuk pelanggan baharu)
    v_store_plan := coalesce(v_store_row.plan_type, 'free');
    v_store_sub_status := coalesce(v_store_row.subscription_status, 'active');

    if v_store_sub_status = 'active' then
        if v_store_plan = 'pro' then
            v_max_allowed := -1; -- Unlimited
        elsif v_store_plan = 'growth' then
            v_max_allowed := 120; -- 20 Free + 100 Growth
        elsif v_store_plan = 'starter' then
            v_max_allowed := 50; -- 20 Free + 30 Starter
        else
            v_max_allowed := 20; -- Free Plan
        end if;
    else
        v_max_allowed := 20; -- Pelan tidak aktif / dibatalkan kembali ke had percuma
    end if;

    if not v_is_existing_customer and v_max_allowed > 0 then
        select count(*) into v_customer_count
        from public.customer_loyalty
        where store_id = v_token_row.store_id;

        if v_customer_count >= v_max_allowed then
            return jsonb_build_object(
                'success', false,
                'error', 'customer_limit_reached',
                'message', format('Kedai ini telah mencapai had maksimum %s pelanggan bagi pelan semasa. Sila hubungi peniaga untuk menaik taraf pelan.', v_max_allowed)
            );
        end if;
    end if;

    v_new_stamps := v_prev_stamps + v_token_row.stamp_count;

    -- 7. Tandakan token sebagai telah ditebus
    update public.stamp_tokens
    set
        status = 'claimed',
        claimed_by = v_customer_id,
        claimed_at = now()
    where id = v_token_row.id;

    -- 8. Kemaskini baki cop pelanggan
    insert into public.customer_loyalty (customer_id, store_id, total_stamps, updated_at)
    values (v_customer_id, v_token_row.store_id, v_new_stamps, now())
    on conflict (customer_id, store_id)
    do update set
        total_stamps = public.customer_loyalty.total_stamps + v_token_row.stamp_count,
        updated_at = now();

    -- 9. Pulangkan hasil penebusan
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
