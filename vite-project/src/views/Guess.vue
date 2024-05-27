<script setup lang="ts">

//Guesser's End

import { ref, onMounted, toValue } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { Loader } from "@googlemaps/js-api-loader"
import router from '../router/index.js'
import Login from './Login.vue';

let mapDiv = ref(null)
let map = ref(null)
let smallMapDiv = ref(null)
let smallMap = ref(null)
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

        panorama = new google.maps.StreetViewPanorama(mapDiv.value, {
            position: map.value.center,
            pov: {
                heading: 34,
                pitch: 10,
            },
            disableDefaultUI: true
            })

        smallMap.value = new window.google.maps.Map(smallMapDiv.value, {
            center: { lat: 20, lng: 0 },
            zoom: 1,
            minZoom: zoom - 15,
            mapTypeId: 'roadmap',
            disableDefaultUI: true,
            fullscreenControl: true,
            zoomControl: true
        })

        let marker = null

        window.google.maps.event.addListener(smallMap.value, 'click', function(event) {
            if ( marker ) {
                marker.setMap(null)
                marker = null
                submitVisible.value = false
            }
            placeMarker(event.latLng)
        })
        
        function placeMarker(location) {
            marker = new window.google.maps.Marker({
                position: location, 
                map: smallMap.value
            })
            submitVisible.value = true
            console.log(marker.position.toString())
        }

        submitForm.value = function() {
            console.log("Submitted")
            console.log('Final Coordinates:', marker.position.toString())
            //Push get.Position() lat and lng coords to supabase
            //Include user info (uuid)
            check()
        }

        function check() {
          placeMarker(map.value.center)
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
        <div ref="smallMapDiv" id="smallMapContainer"></div>
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

  #smallMapContainer {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 30vw;
    height: 30vh;
    z-index: 2;
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

  #map div.poi-info-window .view-link {
       display:none;
  }
</style>
