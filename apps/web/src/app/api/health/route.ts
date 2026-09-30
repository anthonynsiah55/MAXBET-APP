import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  // Liveness only: never claim that untested external services are connected.
  return NextResponse.json({ application: 'maxbet', status: 'ok' }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
