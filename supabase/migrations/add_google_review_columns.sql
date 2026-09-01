-- Migration: Tambah sokongan Google Review ke jadual stores
-- Jalankan dalam Supabase SQL Editor atau sebagai migration file

ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS google_review_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS google_place_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS google_review_mode VARCHAR(20) NOT NULL DEFAULT 'manual';
  -- 'google' = MOD 1 (popup + butang review aktif)
  -- 'manual' = MOD 2 (tiada review, google_review_url mesti NULL)

-- Kekangan ringkas: pastikan mode hanya 2 nilai yang sah
ALTER TABLE public.stores
  DROP CONSTRAINT IF EXISTS google_review_mode_check;
ALTER TABLE public.stores
  ADD CONSTRAINT google_review_mode_check
  CHECK (google_review_mode IN ('google', 'manual'));

-- Kekangan konsisten: kalau mode = manual, url mesti NULL
-- (backend juga enforce ini, tapi baik ada di peringkat DB sekali)
ALTER TABLE public.stores
  DROP CONSTRAINT IF EXISTS google_review_url_consistency_check;
ALTER TABLE public.stores
  ADD CONSTRAINT google_review_url_consistency_check
  CHECK (
    (google_review_mode = 'manual' AND google_review_url IS NULL)
    OR (google_review_mode = 'google')
  );
