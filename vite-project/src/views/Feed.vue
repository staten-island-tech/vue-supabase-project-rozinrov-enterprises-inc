<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { supabase } from '../lib/supabaseClient'

const posts = ref([])

async function fetchPosts() {
  const { data, error } = await supabase
    .from('Posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error.message)
  } else {
    posts.value = data
    await nextTick()
    
  }
}


onMounted(() => {
  fetchPosts()
})

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
    <h1>Welcome to GeoGuessr Social!</h1>
    <div v-if="posts.length === 0">No posts available.</div>
    <div v-else>
      <div v-for="post in posts" :key="post.id" class="post">
        <h2>{{ post.title }}</h2>
        <p>{{ post.caption }}</p>
        <p><small>Posted on: {{ new Date(post.created_at).toLocaleString() }}</small></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
nav {
  margin-bottom: 20px;
}

.post {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
}

h2 {
  margin-top: 0;
}

small {
  color: gray;
}

img {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>