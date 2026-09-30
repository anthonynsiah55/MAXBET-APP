'use client';

import { useEffect } from 'react';
import { logSystemEvent } from '@/lib/monitoring';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { logSystemEvent('application_error', error.digest); }, [error]);
  return <main id="main-content" className="container not-found"><h1>Something went wrong</h1><p>Please try again.</p><button className="button" onClick={reset}>Try again</button></main>;
}
