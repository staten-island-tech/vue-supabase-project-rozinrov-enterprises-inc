<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'


const props = defineProps<{
  initialName: string
  initialEmail: string
  initialPassword: string
}>()

const name = ref(props.initialName || '')
const email = ref(props.initialEmail || '')
const password = ref(props.initialPassword || '')

async function signUpNewUser() {
  const userData = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      emailRedirectTo: 'https://example.com/welcome',
    },
  })

  console.log(userData, supabase)
  const { data, error } = await supabase
    .from('People')
    .insert([{ UUID: userData?.data?.user?.id }])
  if (error) {
    console.error('Error inserting user data:', error)
  } else {
    console.log('User signed up successfully:', userData?.data?.user?.id || null)
  }
}
</script>

<template>
  <nav>
    <RouterLink to="/feed">Feed</RouterLink>
    <RouterLink to="/maps">Maps</RouterLink>
    <RouterLink to="/">login</RouterLink>
    <RouterLink to="/register">Register</RouterLink>
    <RouterLink to="/guess">Guess</RouterLink>
    <RouterLink to="/post">Post</RouterLink>
  </nav>
  <div>
    <h1>Create an Account</h1>
    <input type="text" v-model="name" placeholder="Username" />
    <input type="text" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="signUpNewUser">Submit</button>
  </div>
</template>