<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

const name = ref('')
const email = ref('')
const password = ref('')

console.log('hi')

async function signUpNewUser() {
  const { data, error } = await supabase.auth.signUp({
    name: name.value,
    email: email.value,
    password: name.value,
    options: {
      emailRedirectTo: 'https://example.com/welcome',
    },
  })
}
</script>

<template>
    <div>
        <h1>Create an Account</h1>
        <input type="text" v-model="name" placeholder="Full Name" />
        <input type="text" v-model="email" placeholder="Email" />
        <input type="password" v-model="password" placeholder="Password" />
        <button @click="signUpNewUser">Submit</button>
    </div>
</template>