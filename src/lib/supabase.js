 // ── src/lib/supabase.js ──
// Supabase client config for The Whole Attitude

const SUPABASE_URL = 'https://nodsfweodgxoyqkslkgu.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vZHNmd2VvZGd4b3lxa3Nsa2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMjM2MTgsImV4cCI6MjA4NTg5OTYxOH0.IzkLC5KKS3pdYevwTKiBIn-gowz3ruYr1BFRw_IrORQ';

/**
 * Save an email to the waitlist table.
 * Returns { success: boolean, duplicate: boolean }
 */
export async function saveEmailToSupabase(email) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
        'Accept-Profile': 'public',
        'Content-Profile': 'public',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        joined_at: new Date().toISOString(),
        source: 'landing_page',
      }),
    });

    if (response.status === 409) {
      return { success: true, duplicate: true };
    }

    if (!response.ok) {
      const err = await response.text();
      console.error('Supabase error:', err);
      return { success: false, duplicate: false };
    }

    return { success: true, duplicate: false };
  } catch (err) {
    console.error('Network error:', err);
    return { success: false, duplicate: false };
  }
}

/**
 * Fetch the total number of waitlist signups.
 * Returns a number or null on failure.
 */
export async function getWaitlistCount() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist?select=id`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'count=exact',
        'Accept-Profile': 'public',
      },
    });

    const range = response.headers.get('content-range');
    if (range) {
      const total = range.split('/')[1];
      return total !== '*' ? parseInt(total, 10) : null;
    }
    return null;
  } catch {
    return null;
  }
}