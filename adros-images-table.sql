-- Create the images table with all relevant columns
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  dimensions TEXT,      -- e.g. '1200x600px'
  size BIGINT,          -- file size in bytes
  width INTEGER,        -- width in pixels
  height INTEGER        -- height in pixels
);

-- Example: Insert a new row (fill in your own values)
INSERT INTO images (url, title, uploaded_at, dimensions, size, width, height)
VALUES (
  'https://your-image-url.com/image.webp',
  'image.webp',
  '2025-04-25 21:11:07.918348',
  '1200x600px',
  150000,
  1200,
  600
);

-- You can insert more rows by repeating the INSERT statement above with new values.

-- Add new rows to the existing images table
INSERT INTO images (url, title, uploaded_at, dimensions, size, width, height)
VALUES
  ('https://your-image-url.com/image1.webp', 'image1.webp', '2025-04-25 21:11:07.918348', '1200x600px', 150000, 1200, 600),
  ('https://your-image-url.com/image2.webp', 'image2.webp', '2025-04-25 21:12:07.918348', '800x400px', 90000, 800, 400);

-- ...add more rows as needed...
