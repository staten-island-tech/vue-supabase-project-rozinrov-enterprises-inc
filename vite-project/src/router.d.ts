declare module '../router/index.ts' {
    import { Router } from 'vue-router'
    export const router: Router
}

declare module '../lib/supabaseClient' {
    import { SupabaseClient } from '@supabase/supabase-js'
    export const supabase: SupabaseClient;
  }