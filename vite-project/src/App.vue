<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'
import { RouterLink, RouterView } from 'vue-router'


/* const users = ref([])

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
    email: 'example3@email.com',
    password: 'example-password',
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
} */


</script>

<template>
  <div>
    <h1>a</h1>
    <nav>
      <RouterLink to="/register">Register</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/maps">Maps</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
</style>
