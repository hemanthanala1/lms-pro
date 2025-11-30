import { createClient } from '@supabase/supabase-js';

// In a real application, these should be in a .env file
// process.env.REACT_APP_SUPABASE_URL
// process.env.REACT_APP_SUPABASE_ANON_KEY

// NOTE: We use a syntactically valid URL as a fallback to prevent "Failed to construct 'URL'" errors 
// if the environment variables are not set. The Supabase client throws an error immediately 
// if initialized with a string that is not a valid absolute URL.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://phipuipmuyarykeqzwqs.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoaXB1aXBtdXlhcnlrZXF6d3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTk3ODksImV4cCI6MjA3OTk5NTc4OX0.Ga9Yx1ivVRUVwqfLwL0Yuq7nxyJMOL74ENP9aZp2lCU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);