/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://kbudsmpvtbrxqnstfykq.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidWRzbXB2dGJyeHFuc3RmeWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTA3ODcsImV4cCI6MjA5NzY4Njc4N30.IdAmeOq5xK4X8ojul8rLZt3kIspLT7hncClXscMPrdY";

console.log("Supabase URL initialized:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
