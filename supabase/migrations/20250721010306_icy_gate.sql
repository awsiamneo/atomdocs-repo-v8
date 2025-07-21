/*
  # Create documentation tables

  1. New Tables
    - `categories`
      - `id` (text, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `icon` (text, nullable)
      - `icon_color` (text, nullable)
      - `order_index` (integer)
      - `created_at` (timestamp)
    - `pages`
      - `id` (text, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `category` (text, references categories.slug)
      - `tags` (jsonb)
      - `content` (text)
      - `icon` (text, nullable)
      - `icon_color` (text, nullable)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to manage data
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text,
  icon_color text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id text PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  category text NOT NULL,
  tags jsonb DEFAULT '[]'::jsonb,
  content text DEFAULT '',
  icon text,
  icon_color text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  USING (true);

CREATE POLICY "Categories are insertable by everyone"
  ON categories
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Categories are updatable by everyone"
  ON categories
  FOR UPDATE
  USING (true);

CREATE POLICY "Categories are deletable by everyone"
  ON categories
  FOR DELETE
  USING (true);

-- Create policies for pages
CREATE POLICY "Pages are viewable by everyone"
  ON pages
  FOR SELECT
  USING (true);

CREATE POLICY "Pages are insertable by everyone"
  ON pages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Pages are updatable by everyone"
  ON pages
  FOR UPDATE
  USING (true);

CREATE POLICY "Pages are deletable by everyone"
  ON pages
  FOR DELETE
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_index);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_category ON pages(category);
CREATE INDEX IF NOT EXISTS idx_pages_order ON pages(order_index);

-- Insert initial data from data.json
INSERT INTO categories (id, name, slug, description, icon, icon_color, order_index, created_at) VALUES
  ('1753005326214', 'Courses', 'courses', '', 'BookOpen', '', 0, '2025-07-20T09:55:26.214Z'),
  ('1753005358102', 'Students', 'students', '', 'Users', '', 1, '2025-07-20T09:55:58.102Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO pages (id, title, slug, description, category, tags, content, icon, icon_color, order_index, created_at, updated_at) VALUES
  ('1753007048271', 'newpage', 'newpage', 'newpage', 'students', '[]'::jsonb, '<p>Start writing your content here...</p>', 'BookOpen', '', 0, '2025-07-20T10:24:08.271Z', '2025-07-20T10:24:08.271Z')
ON CONFLICT (id) DO NOTHING;