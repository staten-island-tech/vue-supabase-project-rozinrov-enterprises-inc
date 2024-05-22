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

onMounted(async () => {
    await loader.load()
    const zoom = 17
    try {
      map.value = new window.google.maps.Map(mapDiv.value, {
          center: { lat: 40.7147, lng: -74.0134 },
          zoom: zoom,
          minZoom: zoom - 15,
          mapTypeId: 'satellite',
          tilt: 55
    })
      panorama.value = map.value.getStreetView();
      panorama.value.setPosition({ lat: 40.7147, lng: -74.0134 }); // Set an initial position
      window.google.maps.event.addListener(panorama.value, 'position_changed', function() {
      alert(panorama.value.getPosition().toString());
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


</style>