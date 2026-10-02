import { createClient } from '@supabase/supabase-js';
import { publicConfig } from './config';
// No browser cookies or persisted session: only the recovery OTP can authorize this client.
export function createRecoveryClient() {
  const config = publicConfig();
  if (!config) throw new Error('Recovery is not configured.');
  return createClient(config.url, config.key, { auth: {
    persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, flowType: 'implicit',
  } });
}
