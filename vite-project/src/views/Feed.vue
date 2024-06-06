<template>
  <nav>
    <RouterLink to="/feed">Feed</RouterLink>
    <RouterLink to="/maps">Maps</RouterLink>
    <RouterLink to="/">Login</RouterLink>
    <RouterLink to="/register">Register</RouterLink>
    <RouterLink to="/guess">Guess</RouterLink>
    <RouterLink to="/post">Post</RouterLink>
    <div class="points">
      Total Points: {{ totalPoints }}
    </div>
  </nav>
  <div>
    <h1>Welcome to GeoGuessr Social!</h1>
    <div v-if="posts.length === 0">No posts available.</div>
    <div v-else>
      <div v-for="post in posts" :key="post.post_id" class="post">
        <h2>{{ post.title }}</h2>
        <p>{{ post.caption }}</p>
        <img :src="streetView(post.lat, post.lng)" alt="Street View Image" />
        <p><small>Posted on: {{ new Date(post.created_at).toLocaleString() }}</small></p>
        <button @click="selectPost(post)">
          <RouterLink :to="{ name: 'guess' }">Guess</RouterLink>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import usePostStore from '../post'

const store = usePostStore()
const totalPoints = ref(0)

const streetView = (lat: number, lng: number) => {
  const apiKey = "AIzaSyDALWA-g2AFNDsDyYFlo43-1mjrP3KsoL4"
  return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&key=${apiKey}`
}

async function fetchPosts() {
  const { data, error } = await supabase
    .from('Posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error.message)
  } else {
    store.setPosts(data)
  }
}

async function fetchPoints() {
  const user = await supabase.auth.getUser()
  if (!user) {
    console.error('User is not logged in.')
    return }

  const { data, error } = await supabase
    .from('Games')
    .select('points')
    .eq('user_id', user.data.user.id)

  if (error) {
    console.error('Error fetching points:', error.message)
  } else {
    totalPoints.value = data.reduce((sum, game) => sum + game.points, 0)
  }
}
function selectPost(post: { post_id: string, lat: number, lng: number }) {
  store.selectPost(post)
}

onMounted(() => {
  fetchPoints()
  fetchPosts()
})

const posts = store.posts
</script>

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

.points {
  margin-left: auto;
  padding: 10px;
  background-color: black;
  border-radius: 10px;
  font-weight: bold;
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