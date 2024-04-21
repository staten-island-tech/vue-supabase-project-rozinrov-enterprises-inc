<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const users = ref([])

async function getUsers() {
  const { data } = await supabase.from('People').select()
  users.value = data
}

onMounted(() => {
  getUsers()
})

console.log(users)

async function signUpNewUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'example2@email.com',
    password: 'example-password',
    options: {
      emailRedirectTo: 'https://example.com/welcome',
    },
  })
}

signUpNewUser()
async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'example@email.com',
    password: 'example-password',
  })
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
}


</script>

<template>

</template>

<style scoped>
</style>
