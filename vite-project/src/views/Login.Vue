<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

const email = ref('')
const password = ref('')

console.log('hi')

async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
}
</script>

<template>
    <div>
        <h1>Sign in to your account!</h1>
        <input type="text" v-model="email" placeholder="Email" />
        <input type="password" v-model="password" placeholder="Password" />
        <button @click="signInWithEmail">Submit</button>
    </div>
</template>