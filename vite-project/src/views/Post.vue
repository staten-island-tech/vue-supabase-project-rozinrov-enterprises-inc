<template>
  <nav id="navbar">
      <RouterLink to="/feed">Feed</RouterLink>
      <button id="logout" @click="signOutCurrentUser">Logout</button>
      <div class="points">
        Total Points: {{ totalPoints }}
      </div>
    </nav>
  <div v-if="isLoggedIn">
    <div ref="mapDiv" id="map"></div>
    <div v-if="submitVisible" class="form-container">
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
  </div>
  <div v-else>
    <p>You must be logged in to create a post. Please <a href="/">log in</a>.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase, isLoggedIn } from '../lib/supabaseClient'
import { Loader } from '@googlemaps/js-api-loader'

const router = useRouter()
const title = ref('')
const caption = ref('')
const message = ref<string | null>(null)
const mapDiv = ref(null)
const map = ref(null)
const panorama = ref(null)
const submitVisible = ref(false)
let user = ref(null)

const loader = new Loader({
  apiKey: 'AIzaSyDALWA-g2AFNDsDyYFlo43-1mjrP3KsoL4',
})

async function signOutCurrentUser() {
  await supabase.auth.signOut();
  router.push('/')
}

onMounted(async () => {


  user.value = await supabase.auth.getUser()
  console.log(user.value.id)

  if (!user.value) {
    message.value = 'User not logged in.'
    return
  }

  try {
    await loader.load()
    const zoom = 17
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.value = new window.google.maps.Map(mapDiv.value, {
          center: { lat: position.coords.latitude, lng: position.coords.longitude },
          zoom: zoom,
          minZoom: zoom - 15,
          mapTypeId: 'satellite',
          tilt: 55,
        })

        panorama.value = map.value.getStreetView()
        window.google.maps.event.addListener(panorama.value, 'visible_changed', function () {
          if (panorama.value.getVisible()) {
            console.log('Street View activated')
            submitVisible.value = true
          } else {
            console.log('Street View deactivated')
            submitVisible.value = false
          }
        })
      },
      (error) => {
        console.error('Error getting location:', error.message)
        message.value = 'Error getting location: ' + error.message
      }
    )
  } catch (error) {
    console.error('Error loading Google Maps:', error)
    message.value = 'Error loading Google Maps: ' + error.message
  }
})

async function createPost() {
  if (!panorama.value || title.value.trim() === '' || caption.value.trim() === '') {
    message.value = 'Please fill in all fields and select a location on the map.'
    return
  }

  if (!user.value) {
    message.value = 'User not logged in.'
    return
  }

  const position = panorama.value.getPosition()
  const { data, error } = await supabase.from('Posts').insert([
    {
      title: title.value,
      caption: caption.value,
      created_at: new Date().toISOString(),
      lat: position.lat(),
      lng: position.lng(),
    },
  ])

  if (error) {
    message.value = 'Error creating post: ' + error.message
    console.error('Error creating post:', error.message)
  } else {
    message.value = 'Post created successfully!'
    title.value = ''
    caption.value = ''
    console.log('Post created successfully:', data)
    setTimeout(() => {
      isLoggedIn.value = true
      router.push('/feed')
    }, 2000) 
  }
}
</script>

<style scoped>
#navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40x;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 10;
}

#map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.form-container {
  position: absolute;
  bottom: 5%;
  right: 5%;
  background: black;
  color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 250px;
}

h1 {
  font-size: 18px;
  margin-bottom: 10px;
}

form {
  display: flex;
  flex-direction: column;
}

div {
  margin-bottom: 12px;
}

label {
  margin-bottom: 8px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  color: black;
  background: white;
}

button {
  padding: 8px 16px;
  background: white;
  color: black;
}
</style>