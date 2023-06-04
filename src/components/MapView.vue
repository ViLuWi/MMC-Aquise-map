<template>
  <div>
    <div id="map" class="relative z-10"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import "../assets/marker-green.svg";
import L from "leaflet";
import clearLayers from "leaflet";
const props = defineProps({
  data: Array,
});

const lat_long = ref([]);
const markers = ref([]);

const mapRef = ref();

onMounted(() => {
  const redIcon = L.icon({
    iconUrl: "../src/assets/marker-red.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const blueIcon = L.icon({
    iconUrl: "../src/assets/marker-blue.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const orangeIcon = L.icon({
    iconUrl: "../src/assets/marker-orange.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const greenIcon = L.icon({
    iconUrl: "../src/assets/marker-green.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const purpleIcon = L.icon({
    iconUrl: "../src/assets/marker-purple.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  let MMCMarker = L.icon({
    iconUrl: "../src/assets/mmc-marker.svg",
    iconSize: [100, 60],
    iconAnchor: [50, 60],
    popupAnchor: [0, -45],
  });

  const removeMarkers = () => {
    const map = mapRef.value; // Access the Leaflet map instance from the ref

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
    L.marker([51.400436223587555, 12.196591051438036], { icon: MMCMarker }).addTo(map);
  };

  watchEffect(() => {
    if (props.data.length > 0) {
      markers.value = [];
      lat_long.value = [];
      for (let i = 1; i < props.data.length; i++) {
        let row = props.data[i];

        // Check if all cells in the row are empty
        if (row.slice(0, 3).every((cell) => cell !== "")) {
          let name = row[0];
          let number1 = parseFloat(row[1]);
          let number2 = parseFloat(row[2]);
          let label = row[3];
          console.log(label);
          if (label === "Label") {
            let rowData = [name, number1, number2, label];
            lat_long.value.push(rowData);
          } else if (label === "Händler") {
            let rowData = [name, number1, number2, label];
            lat_long.value.push(rowData);
          } else if (label === "Interior") {
            let rowData = [name, number1, number2, label];
            lat_long.value.push(rowData);
          } else if (label === "Sonstiges") {
            let rowData = [name, number1, number2, label];
            lat_long.value.push(rowData);
          }
        }
      }
      removeMarkers();
      for (let i = 0; i < lat_long.value.length; i++) {
        let marker;
        if (lat_long.value[i][3] === "Label") {
          marker = L.marker([lat_long.value[i][1], lat_long.value[i][2]], {
            icon: blueIcon,
          }).addTo(map);
        } else if (lat_long.value[i][3] === "Händler") {
          marker = L.marker([lat_long.value[i][1], lat_long.value[i][2]], {
            icon: greenIcon,
          }).addTo(map);
        } else if (lat_long.value[i][3] === "Interior") {
          marker = L.marker([lat_long.value[i][1], lat_long.value[i][2]], {
            icon: orangeIcon,
          }).addTo(map);
        } else if (lat_long.value[i][3] === "Sonstiges") {
          marker = L.marker([lat_long.value[i][1], lat_long.value[i][2]], {
            icon: purpleIcon,
          }).addTo(map);
        }
        marker.bindPopup(
          `<p style="font-size: 22px;">${lat_long.value[i][0]}</p><a href="${lat_long.value[i][4]}" target="_blank">Zur Webseite</a>`
        );
        markers.value.push(marker);
      }
    }
  });
  // Create the Leaflet map
  const map = (mapRef.value = L.map("map").setView([51.3972201, 12.1851293], 11));

  // Add a tile layer to the map
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  // Add a marker to the map
  L.marker([51.400436223587555, 12.196591051438036], { icon: MMCMarker }).addTo(map);
});
</script>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
}
</style>
