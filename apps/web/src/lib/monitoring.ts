type EventCode = 'application_error';

// Allowlisted fields only. Never pass raw errors, request bodies, URLs or credentials.
export function logSystemEvent(event: EventCode, digest?: string) {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    event,
    digest: digest && /^[a-zA-Z0-9_-]{1,64}$/.test(digest) ? digest : undefined,
  }));
}
