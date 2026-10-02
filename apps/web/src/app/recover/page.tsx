import type { Metadata } from 'next';
import { ActionLink, Field, Notice } from '../../components/ui';
import { recoveryEnabled } from '../../lib/auth/delivery';
import { requestRecovery, finishRecovery } from './actions';
export const metadata: Metadata={title:'Recover your account',robots:{index:false,follow:false}};
const messages: Record<string,string>={
 requested:'If the address belongs to an eligible account, a recovery email will arrive. Use the code from that email below.',
 invalid:'Check your email and code. Passwords must match and contain at least 12 characters, up to 72 bytes.',
 failed:'We could not reset your password. Request a new code and try again.',
 unavailable:'Account recovery is not open yet.',
};
export default async function RecoveryPage({searchParams}:{searchParams:Promise<{message?:string}>}) {
 const enabled=recoveryEnabled(), message=(await searchParams).message;
 return <main id="main-content" className="container"><div className="page-intro"><p className="eyebrow">ACCOUNT RECOVERY</p><h1>Get back to your account.</h1><p>Reset your password using your registered email address.</p></div><div className="page-body account-grid">
 <section>{message && Object.hasOwn(messages,message) && <Notice title="Recovery update">{messages[message]}</Notice>}
 {!enabled ? <Notice title="Recovery is being prepared">Email delivery is not enabled yet. This preview does not send codes or collect passwords.</Notice> : <><h2>1. Request a code</h2><form action={requestRecovery} className="registration-fields"><Field id="recovery-email" name="email" type="email" label="Registered email" autoComplete="email" required maxLength={254}/><button className="button" type="submit">Send recovery code</button></form>
 <h2>2. Set a new password</h2><form action={finishRecovery} className="registration-fields"><Field id="confirm-email" name="email" type="email" label="Registered email" autoComplete="email" required maxLength={254}/><Field id="recovery-code" name="code" label="Email recovery code" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6,10}" required maxLength={10}/><Field id="new-password" name="password" label="New password" type="password" autoComplete="new-password" required minLength={12} maxLength={72}/><Field id="confirm-password" name="confirm" label="Confirm new password" type="password" autoComplete="new-password" required minLength={12} maxLength={72}/><button className="button" type="submit">Reset password</button></form></>}
 <div className="actions"><ActionLink href="/login" secondary>Back to sign in</ActionLink></div></section>
 <aside className="info-card"><h2>Keep your account yours.</h2><ul><li>Use the email registered to your business account.</li><li>Never share a verification code or password.</li><li>Resetting a password does not change your business approval status.</li></ul></aside></div></main>;
}
