import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// These are your Supabase project configurations
// Shared with AuroraNotes Web project using the same Supabase database
const supabaseUrl = 'https://xnxvcofyvhifecmxeruk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueHZjb2Z5dmhpZmVjbXhlcnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MDA2ODQsImV4cCI6MjA3MjI3NjY4NH0.GSwPnbroXL1Z1fSCh-ObDl5CZZe4ZIp9eOXPA_svL5Y';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic token refresh
    autoRefreshToken: true,
    // Persist session
    persistSession: true,
    // Detect URL changes
    detectSessionInUrl: false,
  },
});
