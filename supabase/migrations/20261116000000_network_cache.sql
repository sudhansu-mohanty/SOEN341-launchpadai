-- Cache for SerpAPI LinkedIn-profile search results, keyed by "company|job title".
-- Only the network-contacts Edge Function (service role) reads/writes this table.
create table if not exists public.network_cache (
  query_key text primary key,
  results jsonb not null,
  fetched_at timestamptz not null default now()
);

alter table public.network_cache enable row level security;