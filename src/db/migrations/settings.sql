-- Create settings table
create table if not exists settings (
  id text primary key,
  whatsapp_number text not null default '',
  email_contact text not null default '',
  phone_contact text not null default '',
  instagram_url text not null default '',
  facebook_url text not null default '',
  youtube_url text not null default '',
  linkedin_url text not null default '',
  company_name text not null default '',
  company_address text not null default '',
  company_creci text not null default '',
  company_postal_code text not null default '',
  company_city text not null default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings
insert into settings (id, whatsapp_number, company_name)
values ('general', '', 'Show Home Now')
on conflict (id) do nothing;

-- Enable RLS
alter table settings enable row level security;

-- Create policies
create policy "Enable read access for all users" on settings for
    select using (true);

create policy "Enable insert/update for authenticated users only" on settings for
    all using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated'); 