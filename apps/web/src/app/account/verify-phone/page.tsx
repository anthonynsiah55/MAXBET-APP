import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ActionLink, Field, Notice } from '../../../components/ui';
import { accountsEnabled } from '../../../lib/supabase/config';
import { phoneVerificationEnabled } from '../../../lib/auth/delivery';
import { createServerAuthClient } from '../../../lib/supabase/server';
import { sendPhoneCode, confirmPhoneCode } from './actions';
export const metadata: Metadata={title:'Verify your phone',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
const messages: Record<string,string>={
 unavailable:'Phone verification is not enabled yet.', invalid:'Enter a valid Ghana phone number or the code from your latest message.',
 failed:'Verification could not be completed. Check the latest code or request another message.',
 sent:'A code was requested for your phone. Enter the latest code below.', 'email-first':'Confirm your email address before linking your phone.',
};
export default async function VerifyPhonePage({searchParams}:{searchParams:Promise<{message?:string}>}) {
 if(!accountsEnabled()) redirect('/login');
 const client=await createServerAuthClient();
 const {data,error}=await client.auth.getUser();
 if(error || !data.user || data.user.is_anonymous) redirect('/login');
 if(data.user.phone && data.user.phone_confirmed_at) redirect('/account');
 const enabled=phoneVerificationEnabled() && !!data.user.email_confirmed_at;
 const message=(await searchParams).message;
 return <main id="main-content" className="container"><div className="page-intro"><p className="eyebrow">CONTACT VERIFICATION</p><h1>Verify your business phone.</h1><p>Link a number you can access to your existing account.</p></div><div className="page-body">
 {message && Object.hasOwn(messages,message) && <Notice title="Verification update">{messages[message]}</Notice>}
 {!enabled ? <Notice title="Verification is not ready">Confirm your email first. SMS delivery must also be enabled before a code can be sent.</Notice> : <section className="account-state-card"><form action={sendPhoneCode} className="registration-fields"><Field id="phone" name="phone" type="tel" label="Ghana phone number" required maxLength={24} autoComplete="tel"/><button type="submit" className="button">Send verification code</button></form>
 {data.user.new_phone && <form action={confirmPhoneCode} className="registration-fields"><Field id="phone-code" name="code" label="SMS verification code" required inputMode="numeric" pattern="[0-9]{6,10}" maxLength={10} autoComplete="one-time-code"/><button type="submit" className="button">Verify phone</button></form>}</section>}
 <div className="actions"><ActionLink href="/account" secondary>Back to account</ActionLink></div></div></main>;
}
