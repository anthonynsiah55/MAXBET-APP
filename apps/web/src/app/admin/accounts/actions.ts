'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAccountReviewer } from '../../../lib/accounts/access';
export async function reviewAccount(form: FormData) {
  const client = await requireAccountReviewer();
  const userId = String(form.get('user_id') || '');
  const version = Number(form.get('version'));
  const status = String(form.get('status') || '');
  const reason = String(form.get('reason') || '').trim();
  const reference = String(form.get('reference') || '').trim();
  if (!/^[0-9a-f-]{36}$/i.test(userId) || !Number.isSafeInteger(version) || version < 1 ||
      !['approved','declined','suspended','pending'].includes(status) || !reason || reason.length > 1000 || reference.length > 100) redirect('/admin/accounts?message=invalid');
  const { error } = await client.rpc('review_customer_account', {
    p_user_id: userId, p_version: version, p_status: status, p_reason: reason, p_femsol_ref: reference || null,
  });
  if (error) redirect('/admin/accounts?message=failed');
  revalidatePath('/admin/accounts'); revalidatePath('/account');
  redirect('/admin/accounts?message=saved');
}
