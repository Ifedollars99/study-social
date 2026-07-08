import { createClient } from '@supabase/supabase-js'





const supabaseUrl = 'https://hbrwrwvhzgpijgvrxmsa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhicndyd3ZoemdwaWpndnJ4bXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MjQyNTYsImV4cCI6MjA5OTEwMDI1Nn0.9n6w1vPPBaqk6oosRMuJ6w_a4iKdpAo5-kVZCbIl2lo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
