<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import {useRouter} from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
console.log('hi')

async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  console.log(data, error)
  setTimeout(() => {
    router.push('/feed')
    }, 2000) 
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