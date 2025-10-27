// Supabase configuration
const SUPABASE_URL = 'https://oxdqbytfrjugvcojydzw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHFieXRmcmp1Z3Zjb2p5ZHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1OTU3MTYsImV4cCI6MjA3NzE3MTcxNn0.buSKV94thn5SUlZXa72QTnJnq0TlQMQ5B9PM_MMUQL8';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

