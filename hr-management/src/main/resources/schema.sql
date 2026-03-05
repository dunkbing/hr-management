-- Auto-migration script for personnel_requests table
-- This will run automatically on application startup

-- Create or update columns in personnel_requests table
ALTER TABLE personnel_requests ADD COLUMN IF NOT EXISTS faculty_head_note TEXT;
ALTER TABLE personnel_requests ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE personnel_requests ADD COLUMN IF NOT EXISTS principal_note TEXT;
ALTER TABLE personnel_requests ADD COLUMN IF NOT EXISTS principal_signature LONGTEXT;
ALTER TABLE personnel_requests ADD COLUMN IF NOT EXISTS principal_signature_date TIMESTAMP;

-- Drop old status constraint if exists
ALTER TABLE personnel_requests DROP CONSTRAINT IF EXISTS personnel_requests_status_check;

-- Create new constraint with all 5 status values
ALTER TABLE personnel_requests 
ADD CONSTRAINT personnel_requests_status_check 
CHECK (status IN ('PENDING_FACULTY_HEAD', 'PENDING_ADMIN', 'PENDING_PRINCIPAL', 'APPROVED', 'REJECTED'));
