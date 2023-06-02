<template>
  <div>
    <div id="map" class="relative z-10"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import L from "leaflet";
const props = defineProps({
  data: Array,
  header: Array,
});

const mapRef = ref();
watchEffect(() => {
  if (props.data.length > 0) {
    console.log(props.data[0][0]);
  }
});

onMounted(() => {
  const redIcon = L.icon({
    iconUrl: "../assets/marker-red.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const blueIcon = L.icon({
    iconUrl: "../assets/marker-blue.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const orangeIcon = L.icon({
    iconUrl: "../assets/marker-orange.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const greenIcon = L.icon({
    iconUrl: "../assets/marker-green.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const purpleIcon = L.icon({
    iconUrl: "../assets/marker-purple.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  let MMCMarker = L.icon({
    iconUrl: "../assets/mmc-marker.svg",
    iconSize: [100, 60],
    iconAnchor: [50, 60],
    popupAnchor: [0, -45],
  });
  // L.icon = function (options) {
  //   return new L.Icon(options);
  // };
  // Create the Leaflet map
  const map = (mapRef.value = L.map("map").setView([51.505, -0.09], 13));

  // Add a tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  // Add a marker to the map
  L.marker([51.5, -0.09], { icon: MMCMarker }).addTo(map);
});
</script>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
}
</style>
