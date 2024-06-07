<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'vue-router'
import { isLoggedIn } from '../lib/supabaseClient'


const email = ref('')
const password = ref('')
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const router = useRouter()

async function signInWithEmail() {
  errorMessage.value = null
  successMessage.value = null

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  
  if (error) {
    errorMessage.value = 'Error logging in: ' + error.message
    console.error('Error logging in:', error.message)
  } else {
    console.log('Logged in successfully:', data)
    successMessage.value = 'You logged in successfully!'
    setTimeout(() => {
      isLoggedIn.value = true
      router.push('/feed')
    }, 2000) 
  }
}


</script>

<template>
  <nav>
    
    <RouterLink to="/register">Register</RouterLink>
  </nav>
  <div>
    <h1>Sign in to your account!</h1>
    <input type="text" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="signInWithEmail">Submit</button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<style scoped>
nav {
  margin-bottom: 20px;
}

div {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

p {
  color: red;
  margin-top: 10px;
}

p:nth-of-type(2) {
  color: green;
}
</style>