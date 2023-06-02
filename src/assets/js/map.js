let url = "assets/data.xlsx"; // Replace with the actual path to your Excel file

// ########## M A P ###########
const map = L.map("map").setView([51.3972201, 12.1851293], 11);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

let layer = new L.StamenTileLayer("toner-background");
let layer2 = new L.StamenTileLayer("toner-lines");
map.addLayer(layer);
map.addLayer(layer2);

let LeafIcon = L.Icon.extend({
  options: {
    iconSize: [26, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -45],
  },
});

let redIcon = new LeafIcon({ iconUrl: "./assets/marker-red.svg" }),
  blueIcon = new LeafIcon({ iconUrl: "./assets/marker-blue.svg" });
OrangeIcon = new LeafIcon({ iconUrl: "./assets/marker-orange.svg" });
GreenIcon = new LeafIcon({ iconUrl: "./assets/marker-green.svg" });
PurpleIcon = new LeafIcon({ iconUrl: "./assets/marker-purple.svg" });
let MMCMarker = new LeafIcon({
  iconUrl: "./assets/mmc-marker.svg",
  iconSize: [100, 60],
  iconAnchor: [50, 60],
  popupAnchor: [0, -45],
});

L.icon = function (options) {
  return new L.Icon(options);
};
const mmc = L.marker([51.400436223587555, 12.196591051438036], {
  icon: MMCMarker,
}).addTo(map);

// mmc.bindPopup("MMC").openPopup();
// ############# EXCEL REQUEST #############
function sendRequest(url) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";

    req.onload = function (e) {
      let data = new Uint8Array(req.response);
      let workbook = XLSX.read(data, { type: "array" });
      let worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      let lat_long = [];

      for (let i = 1; i < jsonData.length; i++) {
        let row = jsonData[i];

        // Check if all cells in the row are empty
        if (row.some((cell) => cell !== "")) {
          let name = row[0];
          let number1 = parseFloat(row[1]);
          let number2 = parseFloat(row[2]);
          let label = row[3];

          // Add the row to the array based on the checkbox values
          let checkbox1 = document.querySelector('input[name="checkbox1"]');
          let checkbox2 = document.querySelector('input[name="checkbox2"]');
          let checkbox3 = document.querySelector('input[name="checkbox3"]');
          let checkbox4 = document.querySelector('input[name="checkbox4"]');

          if (checkbox1.checked && label === "Label") {
            let rowData = [name, number1, number2, label];
            lat_long.push(rowData);
          } else if (checkbox2.checked && label === "Händler") {
            let rowData = [name, number1, number2, label];
            lat_long.push(rowData);
          } else if (checkbox3.checked && label === "Interior") {
            let rowData = [name, number1, number2, label];
            lat_long.push(rowData);
          } else if (checkbox4.checked && label === "Sonstiges") {
            let rowData = [name, number1, number2, label];
            lat_long.push(rowData);
          }
        }
      }

      resolve(lat_long);
    };

    req.onerror = function (error) {
      reject(new Error("Request failed"));
    };

    req.send();
  });
}
let markers = [];
async function processLatLong() {
  // Remove all markers from the map
  for (let i = 0; i < markers.length; i++) {
    let marker = markers[i];
    marker.remove();
  }

  // Clear the 'markers' array
  markers = [];
  try {
    let url = "assets/data.xlsx"; // Replace with the actual path to your Excel file
    let lat_long = await sendRequest(url);
    console.log(lat_long);

    for (let i = 0; i < lat_long.length; i++) {
      let marker;
      if (lat_long[i][3] == "Label") {
        console.log("Label");
        marker = L.marker([lat_long[i][1], lat_long[i][2]], {
          icon: blueIcon,
        }).addTo(map);
      } else if (lat_long[i][3] == "Händler") {
        marker = L.marker([lat_long[i][1], lat_long[i][2]], {
          icon: GreenIcon,
        }).addTo(map);
      } else if (lat_long[i][3] == "Interior") {
        marker = L.marker([lat_long[i][1], lat_long[i][2]], {
          icon: OrangeIcon,
        }).addTo(map);
      } else if (lat_long[i][3] == "Sonstiges") {
        marker = L.marker([lat_long[i][1], lat_long[i][2]], {
          icon: PurpleIcon,
        }).addTo(map);
      }
      marker.bindPopup(
        `<p style="font-size: 22px;">${lat_long[i][0]}</p><a href="${lat_long[i][4]}" target="_blank">Zur Webseite</a>`
      );
      markers.push(marker);
    }
  } catch (error) {
    console.error(error);
  }
}

// Usage
processLatLong();

// Add event listeners to the checkboxes
let checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", processLatLong);
});
