<template>
  <div v-if="post">
    <h1>{{ post.title }}</h1>
    <div ref="streetViewDiv" id="streetView"></div>
    <p>{{ post.caption }}</p>
    <div ref="guessMapDiv" id="guessMap"></div>
    <form @submit.prevent="submitGuess">
      <button type="submit">Submit Guess</button>
    </form>
    <div v-if="message">{{ message }}</div>
  </div>
  <div v-else>
    <p>Loading post...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'
import { Loader } from "@googlemaps/js-api-loader"

const route = useRoute()
const postId = route.params.id

const post = ref(null)
const streetViewDiv = ref(null)
const guessMapDiv = ref(null)
const message = ref('')
const guessMarker = ref(null)
const guessedCoords = ref<{ lat: number; lng: number } | null>(null)

const loader = new Loader({
  apiKey: "AIzaSyDALWA-g2AFNDsDyYFlo43-1mjrP3KsoL4",
})

onMounted(async () => {
  await loader.load()
  
  const { data, error } = await supabase
    .from('Posts')
    .select('*')
    .eq('id', postId)
    .single()

  if (error) {
    message.value = 'Error loading post: ' + error.message
    console.error('Error loading post:', error.message)
  } else {
    post.value = data
    initMaps(data)
  }
})

function initMaps(postData) {
  const streetViewOptions = {
    position: { lat: postData.lat, lng: postData.lng },
    pov: { heading: 34, pitch: 10 },
    disableDefaultUI: true,
  }

  new google.maps.StreetViewPanorama(streetViewDiv.value, streetViewOptions)

  const mapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 2,
  }

  const guessMap = new google.maps.Map(guessMapDiv.value, mapOptions)

  guessMap.addListener('click', (event) => {
    if (guessMarker.value) {
      guessMarker.value.setMap(null)
    }
    guessMarker.value = new google.maps.Marker({
      position: event.latLng,
      map: guessMap,
    })
    guessedCoords.value = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }
  })
}

async function submitGuess() {
  if (!guessedCoords.value) {
    message.value = 'Please select a location on the map.'
    return
  }

  message.value = 'Guess submitted! Coordinates: ' + guessedCoords.value.lat + ', ' + guessedCoords.value.lng
}
</script>

<style scoped>
#streetView {
  width: 100%;
  height: 400px;
  margin-bottom: 16px;
}
#guessMap {
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
button {
  padding: 8px 16px;
}
</style>