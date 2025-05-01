-- Add format column to images table if it doesn't exist
DO $$
BEGIN
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
END $$;
