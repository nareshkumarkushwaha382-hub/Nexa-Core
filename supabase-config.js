// Import the Supabase client library from CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// TODO: Replace these placeholder values with your actual Supabase Project URL and Anon Public Key
const SUPABASE_URL = 'https://hatzbtpcdgduyucdjsad.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdHpidHBjZGdkdXl1Y2Rqc2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyMjg5NzIsImV4cCI6MjEwMTgwNDk3Mn0.LBIreXvBKRdkILsNFS4utuhmwrzUhxnKK3gdjvFyFE4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
