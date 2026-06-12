import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://imliyguhekaauzpojlwy.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbGl5Z3VoZWthYXV6cG9qbHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjQ4OTAsImV4cCI6MjA5MDgwMDg5MH0.HFPGUh_hgF2cHzvcf0wUcwibQmtTDcC5fBOLdcdJY5c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
