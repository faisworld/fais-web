-- Add format column to images table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'images' AND column_name = 'format'
    ) THEN
        ALTER TABLE images ADD COLUMN format VARCHAR(50);
    END IF;
END $$;
