import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vybvkstbpbdetfnfawtq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5YnZrc3RicGJkZXRmbmZhd3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyODE3OTEsImV4cCI6MjA2Njg1Nzc5MX0.ZdZltpvrEyKKXM57w_9HNWI2IdryodFrZGszy0Xy5pQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);