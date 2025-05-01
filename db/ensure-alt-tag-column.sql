-- Ensure the alt-tag column exists in the images table
DO $$
BEGIN
    -- Check if alt-tag column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'images' AND column_name = 'alt-tag'
    ) THEN
        -- Add alt-tag column if it doesn't exist
        ALTER TABLE images ADD COLUMN "alt-tag" TEXT;
        RAISE NOTICE 'Added alt-tag column to images table';
    ELSE
        RAISE NOTICE 'alt-tag column already exists in images table';
    END IF;
END $$;

-- Show the current table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'images'
ORDER BY ordinal_position;
