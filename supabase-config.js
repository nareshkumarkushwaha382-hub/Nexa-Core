/**
 * @file supabase.js
 * @description Supabase client initialization module.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://hatzbtpcdgduyucdjsad.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_publishable_gyNur8Bx4eBr5o40hbtAwg_liwlRB08";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
