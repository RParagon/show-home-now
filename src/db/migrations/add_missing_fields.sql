-- Add missing fields to settings table
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS youtube_url text not null default '',
ADD COLUMN IF NOT EXISTS linkedin_url text not null default '',
ADD COLUMN IF NOT EXISTS company_creci text not null default '',
ADD COLUMN IF NOT EXISTS company_postal_code text not null default '',
ADD COLUMN IF NOT EXISTS company_city text not null default '';

-- Update the existing general settings with default values if needed
UPDATE settings
SET 
  youtube_url = '',
  linkedin_url = '',
  company_creci = '346433',
  company_postal_code = '06850-110',
  company_city = 'Itapecerica da Serra/SP'
WHERE id = 'general'; 