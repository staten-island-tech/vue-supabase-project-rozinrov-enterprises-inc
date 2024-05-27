<template>
    <div v-if="isLoggedIn">
      <h1>Create a New Post</h1>
      <form @submit.prevent="createPost">
        <div>
          <label for="title">Title:</label>
          <input id="title" v-model="title" type="text" required />
        </div>
        <div>
          <label for="caption">Caption:</label>
          <textarea id="caption" v-model="caption" required></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
      <div v-if="message">{{ message }}</div>
    </div>
    <div v-else>
      <p>You must be logged in to create a post. Please <a href="/">log in</a>.</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { supabase } from '../lib/supabaseClient'
  import { isLoggedIn } from '../lib/supabaseClient'
  
  const router = useRouter()
const title = ref('')
const caption = ref('')
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

if (!isLoggedIn.value) {
  router.push('/') 
}

async function createPost() {
  if (title.value.trim() === '' || caption.value.trim() === '') {
    errorMessage.value = 'Title and caption cannot be empty.'
    return
  }

  const user = supabase.auth.getUser()
  if (!user) {
    errorMessage.value = 'User not logged in.'
    return
  }

  const { data, error } = await supabase.from('Posts').insert([
    {
      title: title.value,
      caption: caption.value,
      created_at: new Date().toISOString(),
    }
  ])

  if (error) {
    errorMessage.value = 'Error creating post: ' + error.message
    console.error('Error creating post:', error.message)
  } else {
    successMessage.value = 'Post created successfully!'
    title.value = ''
    caption.value = ''
    console.log('Post created successfully:', data)
  }
}
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: 0 auto;
  }
  
  div {
    margin-bottom: 16px;
  }
  
  label {
    margin-bottom: 8px;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  button {
    padding: 8px 16px;
  }
  </style>