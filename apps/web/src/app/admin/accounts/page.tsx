import type { Metadata } from 'next';
import { Field, Notice, Badge } from '../../../components/ui';
import { requireAccountReviewer } from '../../../lib/accounts/access';
import { reviewAccount } from './actions';
export const metadata: Metadata = { title: 'Account review', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
const transitions: Record<string, [string,string][]> = {
  pending: [['approved','Approve'],['declined','Decline']],
  approved: [['suspended','Pause access']],
  suspended: [['approved','Restore access']],
  declined: [['pending','Reopen review']],
};
export default async function AccountReviewPage({searchParams}: {searchParams: Promise<{message?: string}>}) {
  const client = await requireAccountReviewer();
  const {data: accounts,error} = await client.from('customer_accounts').select('user_id,business_name,contact_name,email,phone,status,femsol_customer_ref,version').order('updated_at',{ascending:true}).limit(50);
  const message=(await searchParams).message;
  return <main id="main-content" className="container"><div className="page-intro"><p className="eyebrow">STAFF ACCOUNT REVIEW</p><h1>Business account requests.</h1><p>Check the business and its FEMSOL customer record before approving access.</p></div><div className="page-body">
    {message && <Notice title="Review result">{message==='saved' ? 'The decision was saved and recorded in the audit trail.' : 'The decision could not be saved. Reload the record and check its state, verified contacts and customer reference.'}</Notice>}
    {error ? <Notice title="Account records unavailable">The review queue could not be loaded. Try again later.</Notice> : !accounts?.length ? <Notice title="No requests to review">New verified applications will appear here.</Notice> : <><p>Showing up to 50 accounts, oldest update first.</p>{accounts.map(account=><section className="account-state-card review-card" key={account.user_id}>
      <Badge>{account.status}</Badge><h2>{account.business_name}</h2><p>{account.contact_name} · {account.email} · {account.phone}</p>
      <form action={reviewAccount} className="registration-fields">
        <input type="hidden" name="user_id" value={account.user_id}/><input type="hidden" name="version" value={account.version}/>
        <Field id={'reference-'+account.user_id} name="reference" label="Verified FEMSOL customer reference" defaultValue={account.femsol_customer_ref || ''} readOnly={!!account.femsol_customer_ref} maxLength={100} hint="Required for approval. Verify this against the existing FEMSOL record; linking does not synchronize data."/>
        <div className="field"><label htmlFor={'decision-'+account.user_id}>Decision</label><select id={'decision-'+account.user_id} name="status" required>{(transitions[account.status] || []).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div>
        <Field id={'reason-'+account.user_id} name="reason" label="Internal review reason" required maxLength={1000} hint="Recorded with your identity. Do not include passwords or unnecessary personal information."/>
        <button type="submit" className="button">Save decision</button>
      </form>
    </section>)}</>}
  </div></main>;
}
