-- Migration: Set sensible defaults for analytics-related fields
-- - stories.target_words: default to 50000 words (can be adjusted later in UI)
-- - chapters.word_count: default to 0 to avoid null math

BEGIN;

-- Ensure the column exists before altering (idempotent-friendly with DO blocks)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'stories' AND column_name = 'target_words'
  ) THEN
    -- Set default target words to 50,000
    EXECUTE 'ALTER TABLE public.stories ALTER COLUMN target_words SET DEFAULT 50000';
    -- Normalize existing rows: if null or 0, set to default 50,000
    EXECUTE 'UPDATE public.stories SET target_words = 50000 WHERE COALESCE(target_words, 0) = 0';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'chapters' AND column_name = 'word_count'
  ) THEN
    -- Set default word_count to 0
    EXECUTE 'ALTER TABLE public.chapters ALTER COLUMN word_count SET DEFAULT 0';
    -- Normalize existing rows
    EXECUTE 'UPDATE public.chapters SET word_count = 0 WHERE word_count IS NULL';
  END IF;
END $$;

-- Apply target_words to all projects that have 0 or NULL (more direct approach)
UPDATE stories 
SET target_words = 50000 
WHERE COALESCE(target_words, 0) = 0;

-- Verify the result
SELECT id, title, target_words, created_at 
FROM stories 
ORDER BY created_at DESC;

COMMIT;


