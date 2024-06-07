<script setup lang="ts">

//Guesser's End

import { ref, onMounted } from 'vue'
import { Loader } from "@googlemaps/js-api-loader"

let map = ref<any | null>(null)
let smallMap = ref<any | null>(null)
let panorama = ref<any | null>(null)
let mapDiv = ref<HTMLElement | null>(null)
let smallMapDiv = ref<HTMLElement | null>(null)
let submitVisible = ref(false)
let canPlace = ref(true)
let submitForm = ref(() => {})

const loader = new Loader({
  apiKey: "AIzaSyDALWA-g2AFNDsDyYFlo43-1mjrP3KsoL4",
})


onMounted(async () => {
    await loader.load()
    const zoom = 17
    try {
      if (mapDiv.value !== null && smallMapDiv.value !== null) {
        map.value = new window.google.maps.Map(mapDiv.value, {
            center: { lat: 42.345573, lng: -71.098326 },
            zoom: zoom,
            minZoom: zoom - 15,
            mapTypeId: 'satellite',
            tilt: 55
        })

        panorama.value = new window.google.maps.StreetViewPanorama(mapDiv.value, {
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
      }
        let marker: google.maps.Marker | null = null

        window.google.maps.event.addListener(smallMap.value, 'click', function(event: { latLng: any; }) {
            if (marker && canPlace.value) {
                marker.setMap(null)
                marker = null
                submitVisible.value = false
            }
            placeMarker(event.latLng)
        })
        
        let markerLat = 0
        let markerLng = 0
        function placeMarker(location: any) {
        if (canPlace.value) {
          marker = new window.google.maps.Marker({
              position: location, 
              map: smallMap.value
          })
        } else {
          console.log('Already submitted. No more markers can be placed.')
        }
          submitVisible.value = true
          if (marker !== null) {
            let markerPosition = marker.getPosition();
            if (markerPosition !== null && markerPosition !== undefined) {
              console.log('Final Coordinates:', markerPosition.toString())
              const formatted = markerPosition.toString().replace(/[(),]/g, '').split(' ')
              markerLat = parseFloat(formatted[0])
              markerLng = parseFloat(formatted[1])
            }
          }
      }

      submitForm.value = function() {
          console.log("Submitted")
          if (marker !== null) {
            let markerPosition = marker.getPosition();
            if (markerPosition !== null && markerPosition !== undefined) {
              console.log('Final Coordinates:', markerPosition.toString())
            }
            //Push get.Position() lat and lng coords to supabase
            //Include user info (uuid)
            check(markerLat, markerLng)
          }
      }
        function check(markerLat: number, markerLng: number) {
          placeMarker(map.value.center)
          const smallMapContainer = document.getElementById("smallMapContainer")
            if (smallMapContainer) {
                smallMapContainer.style.width = "100vw"
                smallMapContainer.style.height = "100vw"
            }
          console.log(markerLat, markerLng)
          console.log(map.value.center.lat(), map.value.center.lng())
          getDistance(markerLat, markerLng, map.value.center.lat(), map.value.center.lng())
          canPlace.value = false
        }

        function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
          let R = 6371 // Radius of the earth in km
          let dLat = deg2rad(lat2-lat1)  // deg2rad below
          let dLon = deg2rad(lon2-lon1) 
          let a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
          
          let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
          let d = R * c // Distance in km
          console.log(d + ' KM')
          let points = 4999.91 * (0.998036) ** d
          const pointsFinal = Math.round(points)
          console.log(pointsFinal)
          alert('You received ' + pointsFinal + ' Points')
        }

        function deg2rad(deg: number) {
          return deg * (Math.PI/180)
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
    height: 40vh;
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
