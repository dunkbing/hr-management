-- Auto-migration script for personnel_requests table
-- This will run automatically on application startup

-- Add faculty_head_note column if it doesn't exist
ALTER TABLE personnel_requests ADD COLUMN IF NOT EXISTS faculty_head_note TEXT;

-- Fix users table schema
ALTER TABLE users ADD COLUMN IF NOT EXISTS official_photo TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS digital_signature TEXT;
ALTER TABLE users ALTER COLUMN avatar TYPE TEXT;

-- Drop old status constraint if exists
ALTER TABLE personnel_requests DROP CONSTRAINT IF EXISTS personnel_requests_status_check;

-- Create new constraint with all 5 status values
ALTER TABLE personnel_requests 
ADD CONSTRAINT personnel_requests_status_check 
CHECK (status IN ('PENDING_FACULTY_HEAD', 'PENDING_ADMIN', 'PENDING_PRINCIPAL', 'APPROVED', 'REJECTED'));
