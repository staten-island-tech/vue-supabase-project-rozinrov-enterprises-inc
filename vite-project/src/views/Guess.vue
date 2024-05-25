<script setup lang="ts">

//Guesser's End

import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { Loader } from "@googlemaps/js-api-loader"
import router from '../router/index.js'

let mapDiv = ref(null)
let map = ref(null)
let panorama = ref(null)
let submitVisible = ref(false)
let submitForm = ref(() => {})

const loader = new Loader({
  apiKey: "AIzaSyDALWA-g2AFNDsDyYFlo43-1mjrP3KsoL4",
})

onMounted(async () => {
    await loader.load()
    const zoom = 17
    try {
        map.value = new window.google.maps.Map(mapDiv.value, {
            center: { lat: 42.345573, lng: -71.098326 },
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
            submitVisible.value = true
        })

        submitForm.value = function() {
            console.log("Submitted")
            console.log(panorama.value.getPosition().toString())
            //Push get.Position() lat and lng coords to supabase
            //Include user info (uuid)
            router.push('/feed')
        }
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
            <h1>Guessing Time!</h1>
            <input type="text" placeholder="Input Location" />
            <form @submit.prevent="submitForm">
              <input type="submit" id="submit" placeholder="Submit" v-if="submitVisible" />
            </form>
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
    z-index: 1;
  }

  #content > * {
    pointer-events: auto;
  }

  #submit {
    margin-top: 35%;
  }

</style>