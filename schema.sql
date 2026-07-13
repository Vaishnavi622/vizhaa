-- ========================================================================
-- Vizhaa Event Management System Database Schema Setup
-- Run this in your Supabase Dashboard SQL Editor
-- ========================================================================

-- ------------------------------------------------------------------------
-- 1. Events Table & Default Seeding
-- ------------------------------------------------------------------------
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  event_key uuid default gen_random_uuid() not null,
  name text not null unique,
  category text not null,
  duration text not null,
  guests text not null,
  price text not null,
  "desc" text,
  img text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.events add constraint events_event_key_key unique (event_key);

-- Enable RLS
alter table public.events enable row level security;

-- Drop existing policies if any to prevent collision errors
drop policy if exists "Allow public read access to events" on public.events;
drop policy if exists "Allow admins full access to events" on public.events;

-- Policies
create policy "Allow public read access to events" on public.events for select using (true);
create policy "Allow admins full access to events" on public.events for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);

-- Seed defaults

insert into public.events (name, category, duration, guests, price, "desc", img) values
('Royal Birthday Party', 'Birthday Celebrations', '1 Day', '50-500', 'From Rs.60,000', 'An extravagant birthday bash fit for royalty with themed decor, gourmet catering and live entertainment.', 'https://images.unsplash.com/photo-1770806850642-5db99488cc75?w=800&h=500&fit=crop&auto=format')
on conflict (name) do update set
  category = excluded.category,
  duration = excluded.duration,
  guests = excluded.guests,
  price = excluded.price,
  "desc" = excluded."desc",
  img = excluded.img;

insert into public.events (name, category, duration, guests, price, "desc", img) values
('Baby Shower', 'Family Celebrations', '3-5 Hours', '20-100', 'From Rs.15,00,000', 'A warm and intimate baby shower with pastel decorations, games and a cherished gift ceremony.', 'https://images.unsplash.com/photo-1597294150753-b6e790b68d1c?w=800&h=500&fit=crop&auto=format')
on conflict (name) do update set
  category = excluded.category,
  duration = excluded.duration,
  guests = excluded.guests,
  price = excluded.price,
  "desc" = excluded."desc",
  img = excluded.img;


-- ------------------------------------------------------------------------
-- 2. Venues Table & Default Seeding
-- ------------------------------------------------------------------------
create table if not exists public.venues (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  city text not null,
  capacity text not null,
  price text not null,
  avail text default 'Available' not null, -- 'Available', 'Booked'
  img text,
  media_type text default 'image' not null, -- 'image' or 'video'
  features text[] default '{}'::text[],
  type text not null, -- 'Marriage Halls', 'Convention Centers', 'Resorts', 'Hotels', 'Outdoor Venues'
  bookings_count integer default 0,
  rating numeric default 4.8,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.venues enable row level security;

-- Drop existing policies if any
drop policy if exists "Allow public read access to venues" on public.venues;
drop policy if exists "Allow admins full access to venues" on public.venues;

-- Policies
create policy "Allow public read access to venues" on public.venues for select using (true);
create policy "Allow admins full access to venues" on public.venues for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);

-- Seed defaults
insert into public.venues (name, city, capacity, price, avail, img, features, type, bookings_count, rating) values
('The Maharaja Grand Hall', 'Andheri West, Mumbai', '200–1500', '₹1,50,000/day', 'Available', 'https://images.unsplash.com/photo-1780542900375-0cf459e38fbb?w=500&h=300&fit=crop&auto=format', '{"AC", "Parking", "Catering", "Stage", "Valet"}', 'Marriage Halls', 8, 4.9)
on conflict (name) do update set
  city = excluded.city,
  capacity = excluded.capacity,
  price = excluded.price,
  avail = excluded.avail,
  img = excluded.img,
  features = excluded.features,
  type = excluded.type,
  bookings_count = excluded.bookings_count,
  rating = excluded.rating;

insert into public.venues (name, city, capacity, price, avail, img, features, type, bookings_count, rating) values
('JW Marriott Juhu', 'Juhu, Mumbai', '100–800', '₹3,50,000/day', 'Booked', 'https://images.unsplash.com/photo-1759519238029-689e99c6d19e?w=500&h=300&fit=crop&auto=format', '{"5-Star", "Beachfront", "Gourmet", "Rooms"}', 'Hotels', 14, 4.9)
on conflict (name) do update set
  city = excluded.city,
  capacity = excluded.capacity,
  price = excluded.price,
  avail = excluded.avail,
  img = excluded.img,
  features = excluded.features,
  type = excluded.type,
  bookings_count = excluded.bookings_count,
  rating = excluded.rating;

insert into public.venues (name, city, capacity, price, avail, img, features, type, bookings_count, rating) values
('Aamby Valley Resort', 'Lonavala, Pune', '50–500', '₹3,00,000/day', 'Available', 'https://images.unsplash.com/photo-1729957385579-528ce50ffd94?w=500&h=300&fit=crop&auto=format', '{"Pool", "Lawn", "Rooms", "Spa", "Outdoor"}', 'Resorts', 6, 4.8)
on conflict (name) do update set
  city = excluded.city,
  capacity = excluded.capacity,
  price = excluded.price,
  avail = excluded.avail,
  img = excluded.img,
  features = excluded.features,
  type = excluded.type,
  bookings_count = excluded.bookings_count,
  rating = excluded.rating;

insert into public.venues (name, city, capacity, price, avail, img, features, type, bookings_count, rating) values
('Della Adventure Resort', 'Khopoli, Maharashtra', '100–800', '₹4,00,000/day', 'Available', 'https://images.unsplash.com/photo-1780542785051-2e320486c71d?w=500&h=300&fit=crop&auto=format', '{"Adventure", "Poolside", "Rooms", "Catering"}', 'Resorts', 5, 4.8)
on conflict (name) do update set
  city = excluded.city,
  capacity = excluded.capacity,
  price = excluded.price,
  avail = excluded.avail,
  img = excluded.img,
  features = excluded.features,
  type = excluded.type,
  bookings_count = excluded.bookings_count,
  rating = excluded.rating;

insert into public.venues (name, city, capacity, price, avail, img, features, type, bookings_count, rating) values
('Olympia Grand Center', 'Lower Parel, Mumbai', '300–2000', '₹2,50,000/day', 'Available', 'https://images.unsplash.com/photo-1759730840961-09faa5731a3b?w=500&h=300&fit=crop&auto=format', '{"Stage", "LED Walls", "AV System", "Parking"}', 'Convention Centers', 9, 4.7)
on conflict (name) do update set
  city = excluded.city,
  capacity = excluded.capacity,
  price = excluded.price,
  avail = excluded.avail,
  img = excluded.img,
  features = excluded.features,
  type = excluded.type,
  bookings_count = excluded.bookings_count,
  rating = excluded.rating;

insert into public.venues (name, city, capacity, price, avail, img, features, type, bookings_count, rating) values
('Regal Celebrations Banquet', 'Borivali, Mumbai', '100–800', '₹90,000/day', 'Available', 'https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=500&h=300&fit=crop&auto=format', '{"AC", "In-house Decor", "DJ"}', 'Marriage Halls', 4, 4.7)
on conflict (name) do update set
  city = excluded.city,
  capacity = excluded.capacity,
  price = excluded.price,
  avail = excluded.avail,
  img = excluded.img,
  features = excluded.features,
  type = excluded.type,
  bookings_count = excluded.bookings_count,
  rating = excluded.rating;


-- ------------------------------------------------------------------------
-- 3. Services Table & Default Seeding
-- ------------------------------------------------------------------------
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  category text not null default 'General',
  tagline text,
  description text, -- category details/info (1-2 lines)
  icon text not null, -- e.g. 'Palette', 'Utensils', 'Camera', 'Music', 'Mail', 'Clipboard'
  img text,
  media_type text default 'image' not null, -- 'image' or 'video'
  price text not null,
  rating numeric default 4.8,
  reviews_count integer default 150,
  items jsonb default '[]'::jsonb, -- list of sub-items: [{"name": "...", "img": "...", "desc": "..."}]
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.services enable row level security;

-- Drop existing policies if any
drop policy if exists "Allow public read access to services" on public.services;
drop policy if exists "Allow admins full access to services" on public.services;

-- Policies
create policy "Allow public read access to services" on public.services for select using (true);
create policy "Allow admins full access to services" on public.services for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);

-- Seed defaults
insert into public.services (name, tagline, description, icon, img, media_type, price, rating, reviews_count, items) values
(
  'Decoration', 
  'Transform spaces into dreamscapes', 
  'Transforming weddings, birthdays, and parties with thematic visual installations and floral arrangements.',
  'Palette', 
  'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=600&h=360&fit=crop&auto=format', 
  'image', 
  '₹25,000', 
  4.9, 
  312, 
  '[
    {"name": "Stage Decoration", "img": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=250&fit=crop", "desc": "Grand royal stage setups with customized drapery, ambient spotlighting, and fresh floral walls."},
    {"name": "Floral Decoration", "img": "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=250&fit=crop", "desc": "Premium pathways and mandap arrangements decorated with handpicked orchids, carnations, and marigolds."},
    {"name": "Balloon Decoration", "img": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop", "desc": "Vibrant balloon designs"},
    {"name": "Theme Decoration", "img": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=250&fit=crop", "desc": "Immersive fairy tale, rustic forest, or starry-night conceptual designs tailored to your event theme."},
    {"name": "Entrance Decoration", "img": "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop", "desc": "Grand entrance setups"},
    {"name": "Mandap Decoration", "img": "https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=500&h=300&fit=crop", "desc": "Traditional mandap designs"},
    {"name": "LED Decoration", "img": "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=500&h=300&fit=crop", "desc": "Modern LED lighting setups"},
    {"name": "Table Decoration", "img": "https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?w=500&h=300&fit=crop", "desc": "Elegant table settings"}
  ]'::jsonb
)
on conflict (name) do update set
  tagline = excluded.tagline,
  description = excluded.description,
  icon = excluded.icon,
  img = excluded.img,
  media_type = excluded.media_type,
  price = excluded.price,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  items = excluded.items;

insert into public.services (name, tagline, description, icon, img, media_type, price, rating, reviews_count, items) values
(
  'Catering', 
  'Culinary excellence for every occasion', 
  'Curating gourmet menus featuring traditional, continental, and live counters for a premium dining experience.',
  'Utensils', 
  'https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=600&h=360&fit=crop&auto=format', 
  'image', 
  '₹450/plate', 
  4.8, 
  287, 
  '[
    {"name": "Vegetarian Gourmet Buffet", "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop", "desc": "Assorted fresh salads, traditional Indian mains, premium naans, cottage cheese delicacies, and local specialty sweets."},
    {"name": "Non-Vegetarian Specialties", "img": "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=250&fit=crop", "desc": "Slow-cooked meat biryanis, roasted chicken configurations, aromatic curries, and coastal fish platters crafted by our top chefs."},
    {"name": "Live Mocktail & Chat Counter", "img": "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&h=250&fit=crop", "desc": "Interactive counters serving sizzling hot street food snacks (panipuri, bhel) and customized fresh tropical fruit mocktails."},
    {"name": "Buffet Service", "img": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=250&fit=crop", "desc": "Extensive buffet service with multi-cuisine options."},
    {"name": "Live Food Counters", "img": "https://images.unsplash.com/photo-1601314002592-b8734bca6604?w=400&h=250&fit=crop", "desc": "Interactive live food stations for an engaging dining experience."},
    {"name": "Sweet & Dessert Counters", "img": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=250&fit=crop", "desc": "A wide variety of traditional and modern desserts."},
    {"name": "Welcome Drinks", "img": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=250&fit=crop", "desc": "Refreshing welcome drinks for all guests upon arrival."}
  ]'::jsonb
)
on conflict (name) do update set
  tagline = excluded.tagline,
  description = excluded.description,
  icon = excluded.icon,
  img = excluded.img,
  media_type = excluded.media_type,
  price = excluded.price,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  items = excluded.items;

insert into public.services (name, tagline, description, icon, img, media_type, price, rating, reviews_count, items) values
(
  'Photography & Videography', 
  'Capture every precious moment', 
  'Documenting your milestones with candid coverage, cinematic wedding highlights, and drone capture.',
  'Camera', 
  'https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=600&h=360&fit=crop&auto=format', 
  'image', 
  '₹35,000', 
  4.9, 
  420, 
  '[
    {"name": "Candid Wedding Photography", "img": "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=250&fit=crop", "desc": "High-definition candid snaps capturing genuine emotions, laughter, and teary highlights in high contrast."},
    {"name": "Cinematic Highlights Film", "img": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=250&fit=crop", "desc": "A custom 5-minute musical highlight reel capturing essential timeline event flows in 4K clarity."},
    {"name": "Drone Aerial Coverage", "img": "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&h=250&fit=crop", "desc": "Breathtaking overhead landscape photography covering venues, guest arrivals, and grand entry moments."}
  ]'::jsonb
)
on conflict (name) do update set
  tagline = excluded.tagline,
  description = excluded.description,
  icon = excluded.icon,
  img = excluded.img,
  media_type = excluded.media_type,
  price = excluded.price,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  items = excluded.items;

insert into public.services (name, tagline, description, icon, img, media_type, price, rating, reviews_count, items) values
(
  'Entertainment', 
  'Keep the energy alive all night', 
  'Dynamic entertainment lineups from premium live DJs, classical orchestras, and anchors to keep the vibes high.',
  'Music', 
  'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=600&h=360&fit=crop&auto=format', 
  'image', 
  '₹20,000', 
  4.7, 
  198, 
  '[
    {"name": "DJ with Sound System", "img": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=250&fit=crop", "desc": "Professional DJ set with high-bass surround sound, club-style lighting rigs, and top charts music library."},
    {"name": "Live Band & Acoustic Set", "img": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=250&fit=crop", "desc": "A dynamic 4-piece band playing Bollywood, pop, and classical mashups for reception and dinner nights."},
    {"name": "Emcee / Event Anchor", "img": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=250&fit=crop", "desc": "Engaging professional emcees to host guest interactive games, family highlights, and stage timelines."}
  ]'::jsonb
)
on conflict (name) do update set
  tagline = excluded.tagline,
  description = excluded.description,
  icon = excluded.icon,
  img = excluded.img,
  media_type = excluded.media_type,
  price = excluded.price,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  items = excluded.items;

insert into public.services (name, tagline, description, icon, img, media_type, price, rating, reviews_count, items) values
(
  'Invitation Design', 
  'First impressions that wow guests', 
  'Premium wedding card printing and custom animations for invitations.',
  'Mail', 
  'https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=600&h=380&fit=crop&auto=format', 
  'image', 
  '₹5,000', 
  4.8, 
  155, 
  '[
    {"name": "Traditional Printed Cards", "img": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=250&fit=crop", "desc": "Elegant heavy-cardstock printed invitations featuring gold leaf embossing and traditional designs."},
    {"name": "Animated Digital Invites", "img": "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=400&h=250&fit=crop", "desc": "Beautiful custom video invitations featuring themed music, storyboards, and digital maps."}
  ]'::jsonb
)
on conflict (name) do update set
  tagline = excluded.tagline,
  description = excluded.description,
  icon = excluded.icon,
  img = excluded.img,
  media_type = excluded.media_type,
  price = excluded.price,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  items = excluded.items;

insert into public.services (name, tagline, description, icon, img, media_type, price, rating, reviews_count, items) values
(
  'Event Coordination', 
  'Expert planners for flawless execution', 
  'On-site coordinators managing everything from vendor timelines to logistics for a stress-free event.',
  'Clipboard', 
  'https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=600&h=360&fit=crop&auto=format', 
  'image', 
  '₹15,000', 
  5.0, 
  234, 
  '[
    {"name": "Day-of Coordinator", "img": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop", "desc": "On-site planners overseeing guest check-ins, catering schedules, and stage program timing."},
    {"name": "Timeline & Budget Planning", "img": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=250&fit=crop", "desc": "Comprehensive vendor contract negotiations, milestone timelines, and strict budget audits."}
  ]'::jsonb
)
on conflict (name) do update set
  tagline = excluded.tagline,
  description = excluded.description,
  icon = excluded.icon,
  img = excluded.img,
  media_type = excluded.media_type,
  price = excluded.price,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  items = excluded.items;


-- ------------------------------------------------------------------------
-- 4. Core Bookings, Payments, and Notifications Tables
-- ------------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  event_name text not null,
  event_date date not null,
  event_time time without time zone,
  guests_count integer,
  venue_id uuid references public.venues(id),
  status booking_status default 'pending' not null,
  amount numeric default 0 not null,
  paid numeric default 0 not null,
  coordinator text,
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for bookings
alter table public.bookings enable row level security;
drop policy if exists "Users can view their own bookings" on public.bookings;
drop policy if exists "Users can insert their own bookings" on public.bookings;
drop policy if exists "Admins have full access to bookings" on public.bookings;

create policy "Users can view their own bookings" on public.bookings for select using (auth.uid() = user_id);
create policy "Users can insert their own bookings" on public.bookings for insert with check (auth.uid() = user_id);
create policy "Admins have full access to bookings" on public.bookings for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);

-- Payments table
create table if not exists public.payments (
  id text primary key,
  booking_id uuid references public.bookings on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  date text not null,
  amount text not null,
  method text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for payments
alter table public.payments enable row level security;
drop policy if exists "Users can view their own payments" on public.payments;
drop policy if exists "Admins have full access to payments" on public.payments;

create policy "Users can view their own payments" on public.payments for select using (auth.uid() = user_id);
create policy "Admins have full access to payments" on public.payments for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);

-- Notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text not null,
  title text not null,
  body text not null,
  time text not null,
  read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for notifications
alter table public.notifications enable row level security;
drop policy if exists "Users can read/update their own notifications" on public.notifications;
create policy "Users can read/update their own notifications" on public.notifications for all using (auth.uid() = user_id);

-- ------------------------------------------------------------------------
-- 5. Reward Schemes & User Loyalty Points Tables
-- ------------------------------------------------------------------------

-- Alter profiles table if exists to add reward points and details
alter table public.profiles add column if not exists reward_points integer default 0;
alter table public.profiles add column if not exists pending_redeem integer default 0;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists preferences text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists blocked boolean default false;
alter table public.profiles add column if not exists contact_notes text;

-- Auto-populate profiles from auth.users metadata on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, address, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'address',
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    phone     = COALESCE(EXCLUDED.phone,     public.profiles.phone),
    address   = COALESCE(EXCLUDED.address,   public.profiles.address),
    email     = COALESCE(EXCLUDED.email,     public.profiles.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create reward_schemes table
create table if not exists public.reward_schemes (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  points_per_thousand integer not null,
  validity_days integer not null,
  min_redemption integer not null,
  min_bookings integer default 0 not null,
  reward_points integer default 0 not null,
  status text default 'Active' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reward_claims table
create table if not exists public.reward_claims (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  scheme_id uuid references public.reward_schemes on delete cascade not null,
  claimed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, scheme_id)
);

-- Enable RLS
alter table public.reward_schemes enable row level security;
alter table public.reward_claims enable row level security;

-- Drop existing policies if any
drop policy if exists "Allow public read access to reward_schemes" on public.reward_schemes;
drop policy if exists "Allow public read access to reward_schemes" on reward_schemes;
drop policy if exists "Allow admins full access to reward_schemes" on public.reward_schemes;
drop policy if exists "Allow admins full access to reward_schemes" on reward_schemes;

drop policy if exists "Users can view their own claims" on public.reward_claims;
drop policy if exists "Users can view their own claims" on reward_claims;
drop policy if exists "Users can insert their own claims" on public.reward_claims;
drop policy if exists "Users can insert their own claims" on reward_claims;
drop policy if exists "Admins can manage all claims" on public.reward_claims;
drop policy if exists "Admins can manage all claims" on reward_claims;

-- Policies for reward_schemes
create policy "Allow public read access to reward_schemes" on public.reward_schemes for select using (true);
create policy "Allow admins full access to reward_schemes" on public.reward_schemes for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);

-- Policies for reward_claims
create policy "Users can view their own claims" on public.reward_claims for select using (auth.uid() = user_id);
create policy "Users can insert their own claims" on public.reward_claims for insert with check (auth.uid() = user_id);
create policy "Admins can manage all claims" on public.reward_claims for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);

-- Seed default reward schemes
insert into public.reward_schemes (name, points_per_thousand, validity_days, min_redemption, min_bookings, reward_points, status) values
('Welcome Bonus Scheme', 100, 365, 500, 0, 100, 'Active'),
('Booking Reward Scheme', 50, 180, 200, 1, 250, 'Active'),
('Referral Reward Scheme', 200, 365, 1000, 2, 500, 'Active')
on conflict (name) do update set
  points_per_thousand = excluded.points_per_thousand,
  validity_days = excluded.validity_days,
  min_redemption = excluded.min_redemption,
  min_bookings = excluded.min_bookings,
  reward_points = excluded.reward_points,
  status = excluded.status;

-- ------------------------------------------------------------------------
-- 6. Realtime Replication Subscription Setup
-- ------------------------------------------------------------------------
-- We wrap these in nested exception blocks to ignore any "already exists" errors.
do $$
begin
  begin
    alter publication supabase_realtime add table public.bookings;
  exception when others then null;
  end;

  begin
    alter publication supabase_realtime add table public.payments;
  exception when others then null;
  end;

  begin
    alter publication supabase_realtime add table public.profiles;
  exception when others then null;
  end;

  begin
    alter publication supabase_realtime add table public.events;
  exception when others then null;
  end;

  begin
    alter publication supabase_realtime add table public.venues;
  exception when others then null;
  end;

  begin
    alter publication supabase_realtime add table public.services;
  exception when others then null;
  end;

  begin
    alter publication supabase_realtime add table public.reward_schemes;
  exception when others then null;
  end;

  begin
    alter publication supabase_realtime add table public.reward_claims;
  exception when others then null;
  end;

  begin
    alter publication supabase_realtime add table public.gallery;
  exception when others then null;
  end;
end $$;

-- ------------------------------------------------------------------------
-- 7. Gallery Table & Policies
-- ------------------------------------------------------------------------
create table if not exists public.gallery (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  caption text,
  category text not null, -- 'Wedding Gallery', 'Birthday Gallery', 'Family Function Gallery', 'Videos'
  media_type text default 'image' not null, -- 'image' or 'video'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.gallery enable row level security;

-- Drop existing policies if any
drop policy if exists "Allow public read access to gallery" on public.gallery;
drop policy if exists "Allow admins full access to gallery" on public.gallery;

-- Policies
create policy "Allow public read access to gallery" on public.gallery for select using (true);
create policy "Allow admins full access to gallery" on public.gallery for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);

-- Seed default gallery files
insert into public.gallery (url, caption, category, media_type) values
('https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=700&h=500&fit=crop&auto=format', 'Grand Entrance Decor', 'Wedding Gallery', 'image'),
('https://images.unsplash.com/photo-1724855946379-451f59d45df6?w=700&h=500&fit=crop&auto=format', 'Wedding Stage Setup', 'Wedding Gallery', 'image'),
('https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=700&h=500&fit=crop&auto=format', 'Bridal Makeover', 'Wedding Gallery', 'image'),
('https://images.unsplash.com/photo-1684868268327-7e5590bcfbd6?w=700&h=500&fit=crop&auto=format', 'Bridal Portrait', 'Wedding Gallery', 'image'),
('https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=700&h=500&fit=crop&auto=format', 'Reception Table Setting', 'Wedding Gallery', 'image'),
('https://images.unsplash.com/photo-1542598688-76ad90c5b01e?w=700&h=500&fit=crop&auto=format', 'Couple Portrait', 'Wedding Gallery', 'image'),
('https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=700&h=500&fit=crop&auto=format', 'Engagement Ceremony', 'Wedding Gallery', 'image'),
('https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=700&h=500&fit=crop&auto=format', 'Floral Table Decor', 'Wedding Gallery', 'image'),
('https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?w=700&h=500&fit=crop&auto=format', 'Happy Birthday Setup', 'Birthday Gallery', 'image'),
('https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&h=500&fit=crop&auto=format', 'Balloon Decoration', 'Birthday Gallery', 'image'),
('https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=700&h=500&fit=crop&auto=format', 'Party Celebration', 'Birthday Gallery', 'image'),
('https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=700&h=500&fit=crop&auto=format', 'Family Gathering', 'Family Function Gallery', 'image'),
('https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=700&h=500&fit=crop&auto=format', 'Function Venue', 'Family Function Gallery', 'image'),
('https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=700&h=500&fit=crop&auto=format', 'Elegant Buffet Setup', 'Family Function Gallery', 'image'),
('https://images.unsplash.com/photo-1724855946379-451f59d45df6?w=700&h=500&fit=crop&auto=format', 'Ceremony Stage', 'Family Function Gallery', 'image'),
('https://images.unsplash.com/photo-1542598688-76ad90c5b01e?w=700&h=440&fit=crop&auto=format', 'Royal Wedding Highlights', 'Videos', 'video'),
('https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=700&h=440&fit=crop&auto=format', 'Mehendi Night Reel', 'Videos', 'video'),
('https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?w=700&h=440&fit=crop&auto=format', 'Birthday Surprise Reveal', 'Videos', 'video'),
('https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=700&h=440&fit=crop&auto=format', 'Reception After-movie', 'Videos', 'video')
on conflict do nothing;

-- ------------------------------------------------------------------------
-- 8. Sub-Services Dynamic Details Table
-- ------------------------------------------------------------------------
create table if not exists public.sub_service_details (
  key text primary key, -- 'CategoryName::SubServiceName'
  description text,
  images text[] default '{}'::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.sub_service_details enable row level security;
-- Budget tier enum
create type public.budget_tier as enum ('low','medium','high');
-- Services table
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  event_key uuid not null references public.events(event_key),
  name text not null,
  description text,
  price numeric not null,
  budget_tier public.budget_tier not null default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- User uploads table
create table if not exists public.user_uploads (
  id uuid default gen_random_uuid() primary key,
  event_key text not null references public.events(event_key),
  user_id uuid not null,
  url text not null,
  media_type text not null check (media_type in ('image','video')),
  budget_tier public.budget_tier not null default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Add budget_tier to gallery
alter table public.gallery add column if not exists budget_tier public.budget_tier not null default 'medium';
alter table public.gallery add column if not exists service_name text;
-- RLS policies for services
drop policy if exists "Allow public read access to services" on public.services;
create policy "Allow public read access to services" on public.services for select using (true);
drop policy if exists "Allow admins full access to services" on public.services;
create policy "Allow admins full access to services" on public.services for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);
-- RLS policies for user_uploads
drop policy if exists "Allow owners to manage their uploads" on public.user_uploads;
create policy "Allow owners to manage their uploads" on public.user_uploads
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policies for sub_service_details
drop policy if exists "Allow public read access to sub_service_details" on public.sub_service_details;
drop policy if exists "Allow admins full access to sub_service_details" on public.sub_service_details;

create policy "Allow public read access to sub_service_details" on public.sub_service_details for select using (true);
create policy "Allow admins full access to sub_service_details" on public.sub_service_details for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);

-- Realtime Replication publication for sub_service_details
do $$
begin
  begin
    alter publication supabase_realtime add table public.sub_service_details;
  exception when others then null;
  end;
end $$;

-- ------------------------------------------------------------------------
-- 9. Automatic Venue Booking Status Triggers
-- ------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_venue_availability_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- If booking is Confirmed, Completed, In Progress, or Pending, mark venue as Booked
  IF NEW.status IN ('Confirmed', 'Completed', 'In Progress', 'Pending') THEN
    UPDATE public.venues
    SET avail = 'Booked'
    WHERE name = NEW.venue;
  -- If booking is Cancelled, mark venue as Available if there are no other active bookings for it
  ELSIF NEW.status = 'Cancelled' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.bookings
      WHERE venue = NEW.venue AND id <> NEW.id AND status IN ('Confirmed', 'Completed', 'In Progress', 'Pending')
    ) THEN
      UPDATE public.venues
      SET avail = 'Available'
      WHERE name = NEW.venue;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trg_update_venue_availability ON public.bookings;

CREATE TRIGGER trg_update_venue_availability
AFTER INSERT OR UPDATE OF status, venue ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_venue_availability_on_booking();


CREATE OR REPLACE FUNCTION public.update_venue_availability_on_booking_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE venue = OLD.venue AND status IN ('Confirmed', 'Completed', 'In Progress', 'Pending')
  ) THEN
    UPDATE public.venues
    SET avail = 'Available'
    WHERE name = OLD.venue;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trg_update_venue_availability_delete ON public.bookings;

CREATE TRIGGER trg_update_venue_availability_delete
AFTER DELETE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_venue_availability_on_booking_delete();


-- ------------------------------------------------------------------------
-- 10. Reviews Table, Policies & Realtime Setup
-- ------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  user_name text not null,
  event_type text not null, -- 'Wedding', 'Reception', 'Birthday', 'Housewarming', 'Baby Shower'
  rating integer not null check (rating >= 1 and rating <= 5),
  text text not null,
  service_name text, -- 'Decoration', 'Catering', 'Photography', 'Entertainment'
  service_rating integer check (service_rating >= 1 and service_rating <= 5),
  supervisor text, -- 'John', 'Kumar', 'Priya'
  supervisor_rating integer check (supervisor_rating >= 1 and supervisor_rating <= 5),
  status text default 'Pending' not null, -- 'Approved', 'Pending', 'Flagged'
  reply text,
  helpful integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Drop existing policies if any
drop policy if exists "Allow public read access to reviews" on public.reviews;
drop policy if exists "Allow users to insert reviews" on public.reviews;
drop policy if exists "Allow admins full access to reviews" on public.reviews;

-- Create policies
create policy "Allow public read access to reviews" on public.reviews for select using (true);
create policy "Allow users to insert reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Allow admins full access to reviews" on public.reviews for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);

-- Add to Realtime replication publication
do $$
begin
  begin
    alter publication supabase_realtime add table public.reviews;
  exception when others then null;
  end;
end $$;


-- ------------------------------------------------------------------------
-- 11. Event Galleries Table (per-event admin-managed gallery)
-- ------------------------------------------------------------------------
create table if not exists public.event_galleries (
  id uuid default gen_random_uuid() primary key,
  event_name text not null,          -- e.g. 'Baby Shower', 'Naming Ceremony'
  event_key  text not null,          -- normalized key e.g. 'baby shower', 'naming ceremony'
  url        text not null,
  caption    text,
  media_type text default 'image' not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.event_galleries enable row level security;

-- Drop existing policies if any
drop policy if exists "Allow public read access to event_galleries" on public.event_galleries;
drop policy if exists "Allow admins full access to event_galleries" on public.event_galleries;

-- Policies
create policy "Allow public read access to event_galleries"
  on public.event_galleries for select using (true);

create policy "Allow admins full access to event_galleries"
  on public.event_galleries for all using (
    auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
  );

-- ------------------------------------------------------------------------
-- 12. Event Packages Table, Policies, Realtime Setup & Seeding
-- ------------------------------------------------------------------------
create table if not exists public.event_packages (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  img text,
  tiers jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.event_packages enable row level security;

-- Policies
drop policy if exists "Allow public read access to event_packages" on public.event_packages;
drop policy if exists "Allow admins full access to event_packages" on public.event_packages;

create policy "Allow public read access to event_packages" on public.event_packages for select using (true);
create policy "Allow admins full access to event_packages" on public.event_packages for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);

-- Add to Realtime replication publication
do $$
begin
  begin
    alter publication supabase_realtime add table public.event_packages;
  exception when others then null;
  end;
end $$;

-- Seed default packages
insert into public.event_packages (name, img, tiers) values
(
  'Wedding Packages',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop&auto=format',
  '[
    {
      "name": "Silver Package",
      "price": "₹2,00,000 – ₹5,00,000",
      "features": [
        "Venue Assistance",
        "Basic Stage Decoration",
        "Floral Decoration",
        "Basic Photography",
        "Standard Videography",
        "Standard Catering",
        "Basic Sound System",
        "Digital Invitation",
        "Guest Seating Arrangement",
        "Event Coordinator"
      ]
    },
    {
      "name": "Gold Package",
      "price": "₹5,00,000 – ₹10,00,000",
      "includes_note": "Includes everything in Silver, plus:",
      "features": [
        "Premium Theme Decoration",
        "Professional Photography",
        "Cinematic Videography",
        "Deluxe Catering",
        "DJ & Entertainment",
        "Bridal Room Setup",
        "Printed Invitations",
        "Guest Management",
        "Dedicated Supervisor",
        "Real-Time Event Tracking"
      ]
    },
    {
      "name": "Platinum Package",
      "price": "₹10,00,000+",
      "includes_note": "Includes everything in Gold, plus:",
      "features": [
        "Luxury Venue",
        "Designer Stage Decoration",
        "Drone Photography",
        "Premium Multi-Cuisine Catering",
        "Live Music & Entertainment",
        "Bridal & Groom Grand Entry",
        "Guest Accommodation",
        "Transportation",
        "Luxury Floral Decoration",
        "Complete End-to-End Event Management"
      ]
    }
  ]'::jsonb
),
(
  'Engagement Packages',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=500&fit=crop&auto=format',
  '[
    {
      "name": "Silver Package",
      "price": "₹50,000 – ₹1,50,000",
      "features": [
        "Venue Assistance",
        "Basic Decoration",
        "Photography",
        "Catering",
        "Sound System",
        "Digital Invitation"
      ]
    },
    {
      "name": "Gold Package",
      "price": "₹1,50,000 – ₹3,00,000",
      "includes_note": "Includes everything in Silver, plus:",
      "features": [
        "Theme Decoration",
        "Professional Photography",
        "Videography",
        "DJ",
        "LED Screen",
        "Dedicated Supervisor",
        "Real-Time Tracking"
      ]
    },
    {
      "name": "Platinum Package",
      "price": "₹3,00,000+",
      "includes_note": "Includes everything in Gold, plus:",
      "features": [
        "Luxury Decoration",
        "Drone Photography",
        "Premium Catering",
        "Live Entertainment",
        "Guest Management",
        "VIP Seating",
        "Complete Event Coordination"
      ]
    }
  ]'::jsonb
),
(
  'Birthday Party Packages',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=500&fit=crop&auto=format',
  '[
    {
      "name": "Silver Package",
      "price": "₹20,000 – ₹50,000",
      "features": [
        "Balloon Decoration",
        "Theme Backdrop",
        "Birthday Cake",
        "Photography",
        "Snacks & Refreshments",
        "Sound System"
      ]
    },
    {
      "name": "Gold Package",
      "price": "₹50,000 – ₹1,00,000",
      "includes_note": "Includes everything in Silver, plus:",
      "features": [
        "Customized Theme Decoration",
        "Professional Photography",
        "DJ",
        "Buffet Catering",
        "Return Gifts",
        "Event Supervisor"
      ]
    },
    {
      "name": "Platinum Package",
      "price": "₹1,00,000+",
      "includes_note": "Includes everything in Gold, plus:",
      "features": [
        "Luxury Theme Setup",
        "Designer Cake",
        "Kids Entertainment",
        "Live Performers",
        "Premium Buffet",
        "Real-Time Tracking"
      ]
    }
  ]'::jsonb
),
(
  'Baby Shower Packages',
  'https://images.unsplash.com/photo-1597294150753-b6e790b68d1c?w=800&h=500&fit=crop&auto=format',
  '[
    {
      "name": "Silver Package",
      "price": "₹25,000 – ₹60,000",
      "features": [
        "Balloon Decoration",
        "Floral Decoration",
        "Photography",
        "Catering",
        "Welcome Board"
      ]
    },
    {
      "name": "Gold Package",
      "price": "₹60,000 – ₹1,50,000",
      "includes_note": "Includes everything in Silver, plus:",
      "features": [
        "Theme Decoration",
        "Professional Photography",
        "Return Gifts",
        "Games Host",
        "Dedicated Supervisor"
      ]
    },
    {
      "name": "Platinum Package",
      "price": "₹1,50,000+",
      "includes_note": "Includes everything in Gold, plus:",
      "features": [
        "Luxury Floral Setup",
        "Cinematic Video",
        "Premium Catering",
        "Premium Return Gifts",
        "Real-Time Tracking"
      ]
    }
  ]'::jsonb
),
(
  'Ear Piercing Ceremony Packages',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=500&fit=crop&auto=format',
  '[
    {
      "name": "Silver Package",
      "price": "₹15,000 – ₹40,000",
      "features": [
        "Basic Decoration",
        "Photography",
        "Catering",
        "Seating Arrangement"
      ]
    },
    {
      "name": "Gold Package",
      "price": "₹40,000 – ₹80,000",
      "includes_note": "Includes everything in Silver, plus:",
      "features": [
        "Theme Decoration",
        "Professional Photography",
        "Return Gifts",
        "Dedicated Supervisor"
      ]
    },
    {
      "name": "Platinum Package",
      "price": "₹80,000+",
      "includes_note": "Includes everything in Gold, plus:",
      "features": [
        "Luxury Decoration",
        "Premium Catering",
        "Premium Photography",
        "Real-Time Tracking"
      ]
    }
  ]'::jsonb
),
(
  'Puberty Function Packages',
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=500&fit=crop&auto=format',
  '[
    {
      "name": "Silver Package",
      "price": "₹50,000 – ₹1,00,000",
      "features": [
        "Stage Decoration",
        "Floral Decoration",
        "Photography",
        "Catering",
        "Sound System"
      ]
    },
    {
      "name": "Gold Package",
      "price": "₹1,00,000 – ₹3,00,000",
      "includes_note": "Includes everything in Silver, plus:",
      "features": [
        "Theme Decoration",
        "Professional Photography",
        "DJ",
        "Invitation Cards",
        "Dedicated Supervisor"
      ]
    },
    {
      "name": "Platinum Package",
      "price": "₹3,00,000+",
      "includes_note": "Includes everything in Gold, plus:",
      "features": [
        "Luxury Stage",
        "Drone Photography",
        "Premium Catering",
        "Live Entertainment",
        "Real-Time Tracking"
      ]
    }
  ]'::jsonb
),
(
  'Housewarming Packages',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=500&fit=crop&auto=format',
  '[
    {
      "name": "Silver Package",
      "price": "₹20,000 – ₹60,000",
      "features": [
        "Entrance Decoration",
        "Floral Decoration",
        "Photography",
        "Catering"
      ]
    },
    {
      "name": "Gold Package",
      "price": "₹60,000 – ₹1,50,000",
      "includes_note": "Includes everything in Silver, plus:",
      "features": [
        "Theme Decoration",
        "Professional Photography",
        "Return Gifts",
        "Dedicated Supervisor"
      ]
    },
    {
      "name": "Platinum Package",
      "price": "₹1,50,000+",
      "includes_note": "Includes everything in Gold, plus:",
      "features": [
        "Luxury Decoration",
        "Premium Catering",
        "Guest Management",
        "Real-Time Tracking"
      ]
    }
  ]'::jsonb
),
(
  'Anniversary Packages',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=500&fit=crop&auto=format',
  '[
    {
      "name": "Silver Package",
      "price": "₹30,000 – ₹80,000",
      "features": [
        "Decoration",
        "Cake",
        "Photography",
        "Catering"
      ]
    },
    {
      "name": "Gold Package",
      "price": "₹80,000 – ₹2,00,000",
      "includes_note": "Includes everything in Silver, plus:",
      "features": [
        "Theme Decoration",
        "Professional Photography",
        "DJ",
        "Return Gifts",
        "Dedicated Supervisor"
      ]
    },
    {
      "name": "Platinum Package",
      "price": "₹2,00,000+",
      "includes_note": "Includes everything in Gold, plus:",
      "features": [
        "Luxury Decoration",
        "Premium Buffet",
        "Live Band",
        "Cinematic Video",
        "Real-Time Tracking"
      ]
    }
  ]'::jsonb
),
(
  'Corporate Event Packages',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=500&fit=crop&auto=format',
  '[
    {
      "name": "Silver Package",
      "price": "₹50,000 – ₹2,00,000",
      "features": [
        "Venue Arrangement",
        "Stage Setup",
        "Audio System",
        "Tea & Snacks",
        "Registration Desk"
      ]
    },
    {
      "name": "Gold Package",
      "price": "₹2,00,000 – ₹5,00,000",
      "includes_note": "Includes everything in Silver, plus:",
      "features": [
        "LED Screen",
        "Professional Photography",
        "Buffet Lunch",
        "Branding Materials",
        "Dedicated Supervisor"
      ]
    },
    {
      "name": "Platinum Package",
      "price": "₹5,00,000+",
      "includes_note": "Includes everything in Gold, plus:",
      "features": [
        "Luxury Venue",
        "Multi-Screen Setup",
        "Premium Catering",
        "Live Streaming",
        "VIP Guest Management",
        "Real-Time Event Tracking",
        "Complete Event Management"
      ]
    }
  ]'::jsonb
)
on conflict (name) do update set
  img = excluded.img,
  tiers = excluded.tiers;

-- ------------------------------------------------------------------------
-- 13. Sub Service Details Table & Policies
-- ------------------------------------------------------------------------
create table if not exists public.sub_service_details (
  key text primary key,
  description text not null,
  images jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.sub_service_details enable row level security;

-- Policies
drop policy if exists "Allow public read access to sub_service_details" on public.sub_service_details;
drop policy if exists "Allow admins full access to sub_service_details" on public.sub_service_details;

create policy "Allow public read access to sub_service_details" on public.sub_service_details for select using (true);
create policy "Allow admins full access to sub_service_details" on public.sub_service_details for all using (
  auth.jwt() ->> 'email' = 'vaishnaviboopathi127@gmail.com'
);

-- Add to Realtime replication publication
do $$
begin
  begin
    alter publication supabase_realtime add table public.sub_service_details;
  exception when others then null;
  end;
end $$;