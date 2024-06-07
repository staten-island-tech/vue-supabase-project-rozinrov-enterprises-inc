declare module '../router/index.ts' {
    import { Router } from 'vue-router'
    const router: Router
    export default router
}


declare module '../lib/supabaseClient' {
    import { SupabaseClient } from '@supabase/supabase-js'
    export const supabase: SupabaseClient;
  }