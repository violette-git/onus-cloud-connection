// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uticeouohtomjezepctd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0aWNlb3VvaHRvbWplemVwY3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NzY3NTAsImV4cCI6MjA0OTU1Mjc1MH0.2zbkCuhHiOcwo6SA31Qt1KgnBeN4KRNHtUQdtSUwv1A";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: {
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
      removeItem: (key) => localStorage.removeItem(key)
    },
    autoRefreshToken: true,
    persistSession: true
  }
});
