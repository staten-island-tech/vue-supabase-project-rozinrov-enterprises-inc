<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
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
const handleSignOut = () => {
  signOut(getAuth()).then(() => {
    router.push('/')
  })
}

</script>

<template>
  <div>
    
    <RouterView />
  </div>
</template>

<style scoped>
</style>