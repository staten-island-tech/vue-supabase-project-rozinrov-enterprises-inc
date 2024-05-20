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
    new window.google.maps.Map(map.value, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
});

</script>

<template>
    <div>
        <h1>Google Maps Integration Test</h1>
        <input type="text" placeholder="Input Location" />
        <div ref="map" id="mapContainer"></div>
    </div>
</template>

<style>
  #mapContainer {
    height: 500px;
    width: 500px;
  }
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>