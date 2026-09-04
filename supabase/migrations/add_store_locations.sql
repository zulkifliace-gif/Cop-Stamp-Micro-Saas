-- Migration: Tambah sokongan lokasi kedai & cawangan (Google Maps)
ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS locations JSONB DEFAULT '[]'::jsonb;
