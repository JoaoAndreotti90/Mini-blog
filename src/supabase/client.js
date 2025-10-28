import { createClient } from "@supabase/supabase-js";

// Pegue a URL do seu painel
const supabaseUrl = "https://tcnrjpmoxghujmyucaxi.supabase.co";

// Pegue a chave 'anon' (public) do seu painel
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbnJqcG1veGdodWpteXVjYXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1OTk4ODIsImV4cCI6MjA3NzE3NTg4Mn0.7W4VKHaUNd-jG1PKqyGHcLTHB3Fz51hGsxUgcvHidJU"; 

// Cria o cliente
export const supabase = createClient(supabaseUrl, supabaseKey);