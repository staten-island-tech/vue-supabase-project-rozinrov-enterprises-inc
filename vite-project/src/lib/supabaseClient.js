import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://itidynjkrpsnrbkcxinb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aWR5bmprcnBzbnJia2N4aW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM2MzcxNTIsImV4cCI6MjAyOTIxMzE1Mn0.jAcNvIcVXm58PgY8kdHny80Wb0RN9mmNtYm8Fyx5xJk')