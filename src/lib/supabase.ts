import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

// These are your Supabase project configurations
// Hard coded with AuroraNotes project using the same Supabase database
const supabaseUrl = 'https://xnxvcoyvhicmxrk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueHZjb3l2aGljbXhya3N1cGFiYXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ5NzQsImV4cCI6MjA1MDU1MDk3NH0.wnbroh-blp_sv'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic token refresh
    autoRefreshToken: true,
    // Persist session
    persistSession: true,
    // Detect session changes
    detectSessionInUrl: false,
  },
})