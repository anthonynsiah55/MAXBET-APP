-- Phase 4 only. Apply after isolated database tests and operational review.
create schema if not exists maxbet_private;
revoke all on schema maxbet_private from public, anon, authenticated;
grant usage on schema maxbet_private to authenticated;

create table maxbet_private.account_reviewers (
  user_id uuid primary key references auth.users(id),
  active boolean not null default true
);
alter table maxbet_private.account_reviewers enable row level security;
revoke all on maxbet_private.account_reviewers from public, anon, authenticated;

create table public.customer_accounts (
  user_id uuid primary key references auth.users(id),
  business_name text not null check (length(trim(business_name)) between 2 and 120),
  contact_name text not null check (length(trim(contact_name)) between 2 and 120),
  email text not null,
  phone text not null check (phone ~ '^\+233[235][0-9]{8}$'),
  status text not null default 'pending' check (status in ('pending','approved','declined','suspended')),
  femsol_customer_ref text unique check (femsol_customer_ref is null or length(trim(femsol_customer_ref)) between 1 and 100),
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'approved' or femsol_customer_ref is not null)
);
create index customer_accounts_review_queue on public.customer_accounts(status, created_at, user_id);
alter table public.customer_accounts enable row level security;
revoke all on public.customer_accounts from public, anon, authenticated;
grant select on public.customer_accounts to authenticated;

create table public.account_review_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.customer_accounts(user_id),
  actor_id uuid not null references auth.users(id),
  previous_status text,
  next_status text not null,
  reason text not null check (length(trim(reason)) between 1 and 1000),
  femsol_customer_ref text,
  account_version integer not null,
  created_at timestamptz not null default now()
);
create index account_review_events_account on public.account_review_events(user_id, id);
alter table public.account_review_events enable row level security;
revoke all on public.account_review_events from public, anon, authenticated;
grant select on public.account_review_events to authenticated;

create function maxbet_private.is_account_reviewer()
returns boolean language sql stable security definer set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1 from maxbet_private.account_reviewers r
    join auth.users u on u.id = r.user_id
    where r.user_id = auth.uid() and r.active and u.email_confirmed_at is not null
      and coalesce(u.is_anonymous, false) = false
  );
$$;
revoke all on function maxbet_private.is_account_reviewer() from public, anon, authenticated;
grant execute on function maxbet_private.is_account_reviewer() to authenticated;

create policy customer_read on public.customer_accounts for select to authenticated
using (user_id = (select auth.uid()) or (select maxbet_private.is_account_reviewer()));
create policy reviewer_audit_read on public.account_review_events for select to authenticated
using ((select maxbet_private.is_account_reviewer()));

create function maxbet_private.submit_account(p_business text, p_contact text)
returns void language plpgsql security definer set search_path = ''
as $$
declare
  caller uuid := auth.uid();
  identity auth.users%rowtype;
begin
  if caller is null then raise exception 'Authentication required' using errcode='42501'; end if;
  select * into identity from auth.users where id = caller;
  if not found or identity.email_confirmed_at is null or identity.phone_confirmed_at is null
    or identity.email is null or identity.phone is null or coalesce(identity.is_anonymous,false)
    then raise exception 'Verify both contacts first' using errcode='42501'; end if;
  if p_business is null or p_contact is null or length(trim(p_business)) not between 2 and 120
    or length(trim(p_contact)) not between 2 and 120
    then raise exception 'Invalid application details' using errcode='22023'; end if;
  -- Identity/contact values come from Auth, never from application metadata.
  insert into public.customer_accounts(user_id,business_name,contact_name,email,phone)
    values (caller,trim(p_business),trim(p_contact),identity.email,'+' || ltrim(identity.phone,'+'));
  insert into public.account_review_events(user_id,actor_id,next_status,reason,account_version)
    values (caller,caller,'pending','Application submitted',1);
end;
$$;
revoke all on function maxbet_private.submit_account(text,text) from public, anon, authenticated;
grant execute on function maxbet_private.submit_account(text,text) to authenticated;

create function maxbet_private.review_account(p_user_id uuid, p_version integer, p_status text, p_reason text, p_femsol_ref text)
returns void language plpgsql security definer set search_path = ''
as $$
declare
  item public.customer_accounts%rowtype;
  reference text := nullif(trim(p_femsol_ref),'');
begin
  if not maxbet_private.is_account_reviewer() or auth.uid() = p_user_id
    then raise exception 'Review not permitted' using errcode='42501'; end if;
  if p_status is null or p_reason is null or length(trim(p_reason)) not between 1 and 1000
    then raise exception 'A review reason is required' using errcode='22023'; end if;
  select * into item from public.customer_accounts where user_id = p_user_id for update;
  if not found then raise exception 'Account unavailable' using errcode='22023'; end if;
  if p_version is null or item.version <> p_version
    then raise exception 'Account changed; reload before reviewing' using errcode='40001'; end if;
  if not ((item.status='pending' and p_status in ('approved','declined'))
       or (item.status='approved' and p_status='suspended')
       or (item.status='suspended' and p_status='approved')
       or (item.status='declined' and p_status='pending'))
    then raise exception 'Invalid account transition' using errcode='22023'; end if;
  if item.femsol_customer_ref is not null and reference is not null and reference <> item.femsol_customer_ref
    then raise exception 'Existing customer link cannot be reassigned here' using errcode='22023'; end if;
  reference := coalesce(item.femsol_customer_ref, reference);
  if p_status='approved' then
    if reference is null then raise exception 'Verified FEMSOL reference required' using errcode='22023'; end if;
    if not exists(select 1 from auth.users u where u.id=p_user_id and u.email_confirmed_at is not null
      and u.phone_confirmed_at is not null and u.email=item.email
      and '+' || ltrim(u.phone,'+')=item.phone and coalesce(u.is_anonymous,false)=false)
      then raise exception 'Customer contacts must be reverified' using errcode='42501'; end if;
  end if;
  update public.customer_accounts set status=p_status,femsol_customer_ref=reference,
    version=version+1,updated_at=now() where user_id=p_user_id;
  insert into public.account_review_events(user_id,actor_id,previous_status,next_status,reason,femsol_customer_ref,account_version)
    values(p_user_id,auth.uid(),item.status,p_status,trim(p_reason),reference,item.version+1);
end;
$$;
revoke all on function maxbet_private.review_account(uuid,integer,text,text,text) from public, anon, authenticated;
grant execute on function maxbet_private.review_account(uuid,integer,text,text,text) to authenticated;

-- Public RPCs use invoker privileges; privileged bodies stay outside the exposed schema.
create function public.submit_customer_account(p_business text,p_contact text)
returns void language sql security invoker set search_path='' as $$
  select maxbet_private.submit_account(p_business,p_contact);
$$;
create function public.review_customer_account(p_user_id uuid,p_version integer,p_status text,p_reason text,p_femsol_ref text default null)
returns void language sql security invoker set search_path='' as $$
  select maxbet_private.review_account(p_user_id,p_version,p_status,p_reason,p_femsol_ref);
$$;
create function public.can_review_customer_accounts()
returns boolean language sql stable security invoker set search_path='' as $$
  select maxbet_private.is_account_reviewer();
$$;
revoke all on function public.submit_customer_account(text,text) from public, anon, authenticated;
revoke all on function public.review_customer_account(uuid,integer,text,text,text) from public, anon, authenticated;
revoke all on function public.can_review_customer_accounts() from public, anon, authenticated;
grant execute on function public.submit_customer_account(text,text) to authenticated;
grant execute on function public.review_customer_account(uuid,integer,text,text,text) to authenticated;
grant execute on function public.can_review_customer_accounts() to authenticated;
