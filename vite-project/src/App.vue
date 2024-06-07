<script setup lang="ts">
import { ref, onMounted, onUnmounted} from 'vue'
import { supabase } from './lib/supabaseClient'
import { RouterLink, RouterView } from 'vue-router'


const session = ref(null)

onMounted(async () => {
  // Retrieve the current session when the component is mounted
  session.value = await supabase.auth.session()
})

// Sign out function
const signOut = async () => {
  await supabase.auth.signOut()
}
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped>
</style>