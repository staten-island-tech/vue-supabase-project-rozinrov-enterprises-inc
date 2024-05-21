<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

import { Loader } from "@googlemaps/js-api-loader"


const loader = new Loader({
  apiKey: "AIzaSyDALWA-g2AFNDsDyYFlo43-1mjrP3KsoL4",
});

let map = ref(null)

onMounted(async () => {
    await loader.load()
    const zoom = 17
    try {
    new window.google.maps.Map(map.value, {
        center: { lat: 40.7147, lng: -74.0134 },
        zoom: zoom,
        minZoom: zoom - 15,
        mapTypeId: 'satellite',
        tilt: 55
    });}
    catch (error) {
        console.log('Error:', error)
    }
});

</script>

<template>
    <div id="app">
        <div ref="map" id="mapContainer"></div>
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