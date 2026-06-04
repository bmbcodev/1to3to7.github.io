-- BIA CO Portfolio Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- ============================================
-- TABLES
-- ============================================

-- Site settings (logo, profile image, founder bio)
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  long_description text,
  cover_image text,
  images text[],
  demo_url text,
  github_url text,
  category text,
  status text DEFAULT 'active',
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Files (downloadable)
CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text,
  file_size bigint,
  download_count int DEFAULT 0,
  storage_path text,
  created_at timestamptz DEFAULT now()
);

-- Messages (contact form)
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  body text NOT NULL,
  fingerprint text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Followers (anonymous, counted by unique fingerprint)
CREATE TABLE followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Visitors (anonymous analytics)
CREATE TABLE visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  fingerprint text,
  country text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Social links
CREATE TABLE social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Activity logs (dashboard feed)
CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Comments on projects
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Reactions on projects (emoji reactions by fingerprint)
CREATE TABLE reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  fingerprint text NOT NULL,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, fingerprint, emoji)
);

-- Message replies (founder ↔ user chat)
CREATE TABLE message_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  sender text NOT NULL DEFAULT 'founder',
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User sessions (online/offline tracking)
CREATE TABLE user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text UNIQUE NOT NULL,
  name text,
  last_seen timestamptz DEFAULT now(),
  is_online boolean DEFAULT false
);

-- ============================================
-- SEED DATA
-- ============================================

-- Initial social links
INSERT INTO social_links (platform, url, icon, sort_order) VALUES
  ('LinkedIn',  'https://www.linkedin.com/in/bizimana-fils-fils-8b94883b9', 'linkedin', 1),
  ('Instagram', 'https://www.instagram.com/1to3to7', 'instagram', 2),
  ('X',         'https://x.com/1to3to7', 'twitter', 3),
  ('TikTok',    'https://tiktok.com/@1to3to7', 'tiktok', 4),
  ('Threads',   'https://www.threads.com/@1to3to7', 'threads', 5),
  ('Twitch',    'https://www.twitch.tv/1to3to7', 'twitch', 6),
  ('ORCID',     'https://orcid.org/0009-0006-4474-9648', 'orcid', 7);

-- Initial site settings
INSERT INTO site_settings (key, value) VALUES
  ('bio', 'Rwandan innovator, Electric Vehicle Technician, and AI Engineer passionate about bridging technology and automotive excellence. Founder of BIA CO (Bizimana Idea Agency Company).'),
  ('logo_url', ''),
  ('profile_image_url', ''),
  ('rwanda_bg_images', '[]');

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES
-- ============================================

-- Public SELECT policies for public-facing data
CREATE POLICY "Public can view site_settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Public can view active projects" ON projects
  FOR SELECT USING (status = 'active' OR status = 'archived');

CREATE POLICY "Public can view files" ON files
  FOR SELECT USING (true);

CREATE POLICY "Public can view social_links" ON social_links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view follower count" ON followers
  FOR SELECT USING (true);

CREATE POLICY "Public can view comments" ON comments
  FOR SELECT USING (true);

-- Insert policies for anonymous users
CREATE POLICY "Anyone can send messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can follow" ON followers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can be tracked" ON visitors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can comment" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view reactions" ON reactions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can react" ON reactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view message_replies" ON message_replies
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view their sessions" ON user_sessions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can upsert sessions" ON user_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update their session" ON user_sessions
  FOR UPDATE USING (true);

-- Authenticated admin policies (using service_role)
CREATE POLICY "Admins can update site_settings" ON site_settings
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage files" ON files
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admins can read messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Admins can update messages" ON messages
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage social_links" ON social_links
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage activity_logs" ON activity_logs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage reactions" ON reactions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage message_replies" ON message_replies
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage user_sessions" ON user_sessions
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage buckets (run in Supabase Storage dashboard or via SQL)
-- Bucket: 'uploads' for all file uploads
-- Make sure to set public access in Supabase dashboard

-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

-- Automatically log new messages
CREATE OR REPLACE FUNCTION log_new_message()
RETURNS trigger AS $$
BEGIN
  INSERT INTO activity_logs (event_type, metadata)
  VALUES ('new_message', jsonb_build_object('message_id', NEW.id, 'name', NEW.name));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION log_new_message();

-- Automatically log new followers
CREATE OR REPLACE FUNCTION log_new_follower()
RETURNS trigger AS $$
BEGIN
  INSERT INTO activity_logs (event_type, metadata)
  VALUES ('new_follower', jsonb_build_object('follower_id', NEW.id));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_follower_insert
  AFTER INSERT ON followers
  FOR EACH ROW EXECUTE FUNCTION log_new_follower();

-- Automatically log new visitors
CREATE OR REPLACE FUNCTION log_new_visitor()
RETURNS trigger AS $$
BEGIN
  INSERT INTO activity_logs (event_type, metadata)
  VALUES ('new_visitor', jsonb_build_object('visitor_id', NEW.id, 'page', NEW.page));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_visitor_insert
  AFTER INSERT ON visitors
  FOR EACH ROW EXECUTE FUNCTION log_new_visitor();
