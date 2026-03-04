-- Auto-migration script for personnel_requests table
-- This will run automatically on application startup
-- All statements are guarded to handle fresh databases where tables don't exist yet

DO $$
BEGIN
    -- Add faculty_head_note column if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'personnel_requests') THEN
        ALTER TABLE personnel_requests ADD COLUMN IF NOT EXISTS faculty_head_note TEXT;

        -- Drop old status constraint if exists and recreate
        ALTER TABLE personnel_requests DROP CONSTRAINT IF EXISTS personnel_requests_status_check;
        ALTER TABLE personnel_requests
            ADD CONSTRAINT personnel_requests_status_check
            CHECK (status IN ('PENDING_FACULTY_HEAD', 'PENDING_ADMIN', 'PENDING_PRINCIPAL', 'APPROVED', 'REJECTED'));
    END IF;

    -- Fix users table schema if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS official_photo TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS digital_signature TEXT;
        ALTER TABLE users ALTER COLUMN avatar TYPE TEXT;
    END IF;
END $$;
