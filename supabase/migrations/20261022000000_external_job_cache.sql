-- Cache for SerpAPI Google Jobs results, keyed by normalized "query|location".
-- Only the search-jobs Edge Function (service role) reads/writes this table.
create table if not exists public.external_job_cache (
  query_key text primary key,
  results jsonb not null,
  fetched_at timestamptz not null default now()
);

alter table public.external_job_cache enable row level security;
