-- Rollback leaves the isolated test database empty of fixtures.
begin;
insert into auth.users values
 ('00000000-0000-0000-0000-000000000001','a@example.test','233240000001',now(),now(),false),
 ('00000000-0000-0000-0000-000000000002','b@example.test','233240000002',now(),now(),false),
 ('00000000-0000-0000-0000-000000000003','staff@example.test','233240000003',now(),now(),false),
 ('00000000-0000-0000-0000-000000000004','unverified@example.test','233240000004',now(),null,false);
insert into maxbet_private.account_reviewers(user_id) values ('00000000-0000-0000-0000-000000000003');
create function pg_temp.assert_true(ok boolean, description text) returns void language plpgsql as $$
begin if ok is distinct from true then raise exception 'FAIL: %',description; end if; end;
$$;
create function pg_temp.denied(command text, expected text) returns void language plpgsql as $$
declare actual text;
begin
  begin execute command; exception when others then get stacked diagnostics actual=returned_sqlstate; end;
  if actual is distinct from expected then raise exception 'Expected %, got % for %',expected,actual,command; end if;
end;
$$;

set local role anon;
select pg_temp.denied('select * from public.customer_accounts','42501');
select pg_temp.denied($q$select public.submit_customer_account('Anon pharmacy','Anon contact')$q$,'42501');
reset role;
set local role authenticated;
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000004';
select pg_temp.denied($q$select public.submit_customer_account('Unverified','Test contact')$q$,'42501');
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000001';
select public.submit_customer_account('Pharmacy A','Contact A');
select pg_temp.denied($q$select public.submit_customer_account('Duplicate','Contact A')$q$,'23505');
select pg_temp.denied($q$update public.customer_accounts set status='approved'$q$,'42501');
select pg_temp.denied($q$insert into maxbet_private.account_reviewers(user_id) values(auth.uid())$q$,'42501');
select pg_temp.denied($q$select public.review_customer_account(auth.uid(),1,'approved','Self approval','F-1')$q$,'42501');
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000002';
select pg_temp.assert_true((select count(*)=0 from public.customer_accounts),'cross-customer isolation');
select public.submit_customer_account('Pharmacy B','Contact B');
select pg_temp.assert_true((select count(*)=1 from public.customer_accounts),'own record only');
select pg_temp.assert_true((select count(*)=0 from public.account_review_events),'staff notes hidden from customer');

set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000003';
select pg_temp.assert_true(public.can_review_customer_accounts(),'authorized reviewer');
select pg_temp.assert_true((select count(*)=2 from public.customer_accounts),'review queue visibility');
select pg_temp.denied($q$select public.review_customer_account('00000000-0000-0000-0000-000000000001',1,'approved','Checked',null)$q$,'22023');
select public.review_customer_account('00000000-0000-0000-0000-000000000001',1,'approved','FEMSOL identity matched','F-1');
select pg_temp.denied($q$select public.review_customer_account('00000000-0000-0000-0000-000000000002',1,'approved','Duplicate customer','F-1')$q$,'23505');
select pg_temp.assert_true((select version=1 and status='pending' from public.customer_accounts where user_id='00000000-0000-0000-0000-000000000002'),'failed decision rolled back');
select pg_temp.denied($q$select public.review_customer_account('00000000-0000-0000-0000-000000000001',1,'suspended','Stale update',null)$q$,'40001');
select public.review_customer_account('00000000-0000-0000-0000-000000000001',2,'suspended','Access paused',null);
select pg_temp.denied($q$select public.review_customer_account('00000000-0000-0000-0000-000000000001',3,'approved','Wrong reference','F-2')$q$,'22023');
select public.review_customer_account('00000000-0000-0000-0000-000000000001',3,'approved','Restored after review',null);
select pg_temp.assert_true((select count(*)=5 from public.account_review_events),'submission and decision audit count');
select pg_temp.denied('delete from public.account_review_events','42501');
select pg_temp.denied($q$select public.review_customer_account('00000000-0000-0000-0000-000000000001',4,'pending','Invalid transition',null)$q$,'22023');
reset role;
update maxbet_private.account_reviewers set active=false;
set local role authenticated;
select pg_temp.assert_true(not public.can_review_customer_accounts(),'reviewer revocation effective immediately');
select pg_temp.denied($q$select public.review_customer_account('00000000-0000-0000-0000-000000000001',4,'suspended','Revoked staff',null)$q$,'42501');
rollback;
