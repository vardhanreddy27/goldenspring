-- Create admin_announcements table for in-app parent announcement feed
CREATE TABLE IF NOT EXISTS admin_announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
