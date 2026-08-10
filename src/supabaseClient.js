/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://kbudsmpvtbrxqnstfykq.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidWRzbXB2dGJyeHFuc3RmeWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTA3ODcsImV4cCI6MjA5NzY4Njc4N30.IdAmeOq5xK4X8ojul8rLZt3kIspLT7hncClXscMPrdY";

// Fast fetch wrapper with 10s timeout to prevent unreachable network requests from blocking UI endlessly while allowing valid Supabase calls to complete smoothly
const customFetch = async (url, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
    });
    return res;
  } catch (err) {
    throw err;
  } finally {
    clearTimeout(timer);
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: customFetch,
  },
});

