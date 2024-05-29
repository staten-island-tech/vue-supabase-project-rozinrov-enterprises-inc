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
let title = ref('')
let caption = ref('')
let message = ref<string | null>(null)
let mapDiv = ref(null)
let map = ref(null)
let panorama = ref(null)
let submitVisible = ref(false)
let submitForm = ref(() => {})

const loader = new Loader({
  apiKey: "AIzaSyDALWA-g2AFNDsDyYFlo43-1mjrP3KsoL4",
})

onMounted(async () => {
  if (!isLoggedIn.value) {
    router.push('/')
  }

  await loader.load()
    const zoom = 17
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        map.value = new window.google.maps.Map(mapDiv.value, {
          center: { lat: position.coords.latitude, lng: position.coords.longitude },
          zoom: zoom,
          minZoom: zoom - 15,
          mapTypeId: 'satellite',
          tilt: 55
        })

        panorama.value = map.value.getStreetView()
        window.google.maps.event.addListener(panorama.value, 'position_changed', function() {
          console.log(panorama.value.getPosition().toString())
        })

        window.google.maps.event.addListener(panorama.value, 'visible_changed', function() {
          submitVisible.value = true
        })

        submitForm.value = function() {
          console.log("Submitted")
          console.log(panorama.value.getPosition().toString())
          //Push get.Position() lat and lng coords to supabase
          //Include user info (uuid)
          router.push('/feed') 
        }
      })
}

async function createPost() {
  if (!.value || title.value.trim() === '' || caption.value.trim() === '') {
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
      lat: map.value.lat,
      lng: map.value.lng
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