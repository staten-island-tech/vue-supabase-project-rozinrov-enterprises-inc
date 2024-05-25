<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

import { Loader } from "@googlemaps/js-api-loader"


const loader = new Loader({
  apiKey: "AIzaSyDALWA-g2AFNDsDyYFlo43-1mjrP3KsoL4",
});

let mapDiv = ref(null)
let map = ref(null)
let panorama = ref(null)
let submitVisible = ref(false)

onMounted(async () => {
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

        panorama.value = map.value.getStreetView();
        window.google.maps.event.addListener(panorama.value, 'position_changed', function() {
          console.log(panorama.value.getPosition().toString())
        })

        window.google.maps.event.addListener(panorama.value, 'visible_changed', function() {
          const submit = document.querySelector('#submit')
          submitVisible.value = true
          submit.addEventListener('submit', function() {
            console.log('Submitted')
          })
        })
      })
    }
    catch (error) {
        console.log('Error:', error)
    }
})

</script>

<template>
    <div id="app">
        <div ref="mapDiv" id="mapContainer"></div>
        <div id="content">
            <h1>Google Maps Integration Test</h1>
            <input type="text" placeholder="Input Location" />
            <input type="submit" id="submit" placeholder="Submit" v-if="submitVisible" />
        </div>
    </div>
</template>

<style>
   #mapContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  #content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
  }

  #content > * {
    pointer-events: auto;
  }

  #submit {
    margin-top: 35%;
  }

</style>