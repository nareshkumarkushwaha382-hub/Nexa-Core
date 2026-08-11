/**
 * @file supabase-config.js
 * @description Supabase client initialization module.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://hatzbtpcdgduyucdjsad.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdHpidHBjZGdkdXl1Y2Rqc2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyMjg5NzIsImV4cCI6MjEwMTgwNDk3Mn0.LBIreXvBKRdkILsNFS4utuhmwrzUhxnKK3gdjvFyFE4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
