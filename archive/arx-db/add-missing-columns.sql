-- Add missing columns to images table if they don't exist
DO $$
BEGIN
    -- Add format column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'images' AND column_name = 'format'
    ) THEN
        ALTER TABLE images ADD COLUMN format VARCHAR(50);
        RAISE NOTICE 'Added format column to images table';
    ELSE
        RAISE NOTICE 'Format column already exists in images table';
    END IF;

    -- Add description column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'images' AND column_name = 'description'
    ) THEN
        ALTER TABLE images ADD COLUMN description TEXT;
        RAISE NOTICE 'Added description column to images table';
    ELSE
        RAISE NOTICE 'Description column already exists in images table';
    END IF;
END $$;

-- Show the current table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'images'
ORDER BY ordinal_position;
