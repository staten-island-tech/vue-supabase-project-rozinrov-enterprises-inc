<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

const name = ref('')
const email = ref('')
const password = ref('')

async function signUpNewUser() {
  const userData = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      emailRedirectTo: 'https://example.com/welcome',
    },
  })

  console.log(userData, supabase)
  const { error } = await supabase
      .from('People')
      .insert([{ UUID: userData?.data?.user?.id || null, Points: 0 }])
      if (error) {
            console.error('Error inserting user data:', error);
        } else {
            console.log('User signed up successfully:', userData?.data?.user?.id || null);
        }
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