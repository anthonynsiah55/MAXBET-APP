-- Isolated PostgreSQL CI fixture only. Never run this against a Supabase project.
create role anon nologin;
create role authenticated nologin;
create schema auth;
create table auth.users (
 id uuid primary key, email text, phone text, email_confirmed_at timestamptz,
 phone_confirmed_at timestamptz, is_anonymous boolean default false
);
create function auth.uid() returns uuid language sql stable as $$
 select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid;
$$;
grant usage on schema auth to authenticated,anon;
grant execute on function auth.uid() to authenticated,anon;
