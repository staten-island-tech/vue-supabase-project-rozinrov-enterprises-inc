<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { supabase } from '../lib/supabaseClient'

const posts = ref([])

function StreetView(lat: number, lng: number): string {
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
    posts.value = data
    await nextTick()
    startView()
  }
}

async function startView() {
  await loader.load()
  posts.value.forEach(post => {
    const panoramaDiv = document.getElementById(`panorama-${post.id}`)
    if (panoramaDiv) {
      new google.maps.StreetViewPanorama(panoramaDiv, {
        position: { lat: post.lat, lng: post.lng },
        pov: {
          heading: 34,
          pitch: 10,
        },
        visible: true,
      })
    }
  })
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
        <img :src="StreetView(post.lat, post.lng)" alt="Street View Image" />
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