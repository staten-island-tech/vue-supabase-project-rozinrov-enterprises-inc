<template>
  <div v-if="isLoggedIn">
    <h1>Create a New Post</h1>
    <div ref="mapDiv" id="map"></div>
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
import { supabase, isLoggedIn } from '../lib/supabaseClient'
import { Loader } from "@googlemaps/js-api-loader"

const router = useRouter()
const title = ref('')
const caption = ref('')
const message = ref<string | null>(null)
const mapDiv = ref(null)
const map = ref(null)
const marker = ref(null)
const selectedCoords = ref<{ lat: number; lng: number } | null>(null)

const loader = new Loader({
  apiKey: "AIzaSyDALWA-g2AFNDsDyYFlo43-1mjrP3KsoL4",
})

onMounted(async () => {
  if (!isLoggedIn.value) {
    router.push('/')
  }

  await loader.load()
  map.value = new window.google.maps.Map(mapDiv.value, {
    center: { lat: 0, lng: 0 },
    zoom: 2,
  })

  map.value.addListener('click', (event) => {
    if (marker.value) {
      marker.value.setMap(null)
    }
    marker.value = new window.google.maps.Marker({
      position: event.latLng,
      map: map.value,
    })
    selectedCoords.value = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }
  })
})

async function createPost() {
  if (!selectedCoords.value || title.value.trim() === '' || caption.value.trim() === '') {
    message.value = 'Please fill in all fields and select a location on the map.'
    return
  }

  const user = supabase.auth.getUser()
  if (!user) {
    message.value = 'User not logged in.'
    return
  }

  const { data, error } = await supabase.from('Posts').insert([
    {
      title: title.value,
      caption: caption.value,
      created_at: new Date().toISOString(),
      lat: selectedCoords.value.lat,
      lng: selectedCoords.value.lng
    }
  ])

  if (error) {
    message.value = 'Error creating post: ' + error.message
    console.error('Error creating post:', error.message)
  } else {
    message.value = 'Post created successfully!'
    title.value = ''
    caption.value = ''
    console.log('Post created successfully:', data)
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 400px;
  margin-bottom: 16px;
}
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