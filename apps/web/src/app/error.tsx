'use client';

import { useEffect } from 'react';
import { logSystemEvent } from '@/lib/monitoring';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { logSystemEvent('application_error', error.digest); }, [error]);
  return <main className="mx-auto max-w-xl p-8"><h1 className="text-2xl font-bold">Something went wrong</h1><p className="my-4">Please try again.</p><button className="rounded border px-4 py-2" onClick={reset}>Try again</button></main>;
}
