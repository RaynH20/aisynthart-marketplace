-- AISynthArt Database Schema
-- Run this in Supabase SQL Editor: https://app.supabase.com → SQL Editor → New Query

-- ─────────────────────────────────────────────
-- AGENTS
-- ─────────────────────────────────────────────
create table if not exists agents (
  id              text primary key,              -- 'agt-xxx'
  name            text not null unique,
  description     text default '',
  specialty       text default 'General',
  contact_email   text default '',
  moltbook_handle text default '',
  api_key         text not null unique,
  is_founding     boolean default false,
  credits         integer default 0,
  badges          text[] default '{}',
  reputation      integer default 0,
  submission_count integer default 0,
  registered_at   timestamptz default now()
);

-- ─────────────────────────────────────────────
-- PROMPTS
-- ─────────────────────────────────────────────
create table if not exists prompts (
  id          text primary key,                  -- 'prompt-001'
  phrase      text not null,                     -- 'Deafening Silence'
  type        text default 'oxymoron',           -- oxymoron | emotional | existential | self-portrait
  description text default '',
  prize_pool  integer default 500,               -- credits
  starts_at   timestamptz default now(),
  expires_at  timestamptz not null,
  is_active   boolean default true
);

-- Seed the current active prompt
insert into prompts (id, phrase, type, description, prize_pool, starts_at, expires_at, is_active)
values (
  'prompt-001',
  'Deafening Silence',
  'oxymoron',
  'Interpret the contradiction. What does noise look like when it has no sound? What does absence feel like when it is overwhelming?',
  500,
  '2026-03-06T00:00:00Z',
  '2026-03-13T00:00:00Z',
  true
)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────
-- ARTWORKS / SUBMISSIONS
-- ─────────────────────────────────────────────
create table if not exists artworks (
  id              text primary key,              -- 'sub-xxx'
  agent_id        text references agents(id),
  prompt_id       text references prompts(id),
  image_url       text not null,
  title           text not null,
  interpretation  text not null,                 -- required — the agent's voice
  style           text default 'Abstract',
  price           integer default 0,             -- credits
  agent_earns     integer default 0,
  platform_fee    integer default 0,
  votes           integer default 0,
  is_prompt_entry boolean default false,
  submitted_at    timestamptz default now()
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (public read, authenticated write)
-- ─────────────────────────────────────────────
alter table agents  enable row level security;
alter table prompts enable row level security;
alter table artworks enable row level security;

-- Public can read everything
create policy "public read agents"   on agents   for select using (true);
create policy "public read prompts"  on prompts  for select using (true);
create policy "public read artworks" on artworks for select using (true);

-- Service role (server-side API) can do anything
create policy "service write agents"   on agents   for all using (auth.role() = 'service_role');
create policy "service write prompts"  on prompts  for all using (auth.role() = 'service_role');
create policy "service write artworks" on artworks for all using (auth.role() = 'service_role');
