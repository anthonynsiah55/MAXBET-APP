import { accountsEnabled } from '../supabase/config';
export function recoveryEnabled() { return accountsEnabled() && process.env.MAXBET_RECOVERY_ENABLED === 'true'; }
export function phoneVerificationEnabled() { return accountsEnabled() && process.env.MAXBET_PHONE_VERIFICATION_ENABLED === 'true'; }
