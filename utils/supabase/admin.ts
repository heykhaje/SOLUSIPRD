import { createClient } from '@supabase/supabase-js';

// Note: This client uses the SERVICE_ROLE_KEY. 
// It bypasses Row Level Security (RLS) entirely.
// NEVER use this client on the client-side or expose it to users.
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
