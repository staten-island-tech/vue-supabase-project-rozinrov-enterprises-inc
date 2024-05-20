<script setup lang="ts">
import { supabase } from '../lib/supabaseClient'

import { Loader } from "@googlemaps/js-api-loader"


const loader = new Loader({
  apiKey: "AIzaSyDALWA-g2AFNDsDyYFlo43-1mjrP3KsoL4",
});

let map: google.maps.Map;


loader.load().then(async () => {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  map = new Map(document.getElementById("map") as HTMLElement, {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
});

</script>

<template>
    <div>
        <h1>Google Maps Integration Test</h1>
        <input type="text" placeholder="Input Location" />
        <div id="map"></div>
    </div>
</template>

<style>
  #map {
    height: 100%;
  }
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>