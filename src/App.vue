<template>
  <div class="relative">
    <MapView :data="data" />
    <div class="absolute top-6 right-6 z-20 inline-flex items-center space-x-3">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileInputChange"
        class="bg-white p-1 rounded-lg"
      />
      <button
        data-modal-target="defaultModal"
        data-modal-toggle="defaultModal"
        class="block text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        type="button"
      >
        Filter
      </button>
    </div>
    <div
      id="defaultModal"
      tabindex="-1"
      aria-hidden="true"
      class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Filtern</h3>
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="defaultModal"
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6 space-y-6">
            <div class="flex items-center mb-4">
              <input
                id="checkbox1"
                type="checkbox"
                @change="handleFileInputChange"
                v-model="checkbox1"
                name="checkbox1"
                class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="checkbox1" class="ml-2 text-lg text-blue-600">Labels</label>
            </div>
            <div class="flex items-center mb-4">
              <input
                id="checkbox2"
                type="checkbox"
                checked
                @change="handleFileInputChange"
                v-model="checkbox2"
                name="checkbox2"
                class="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label for="checkbox2" class="ml-2 text-lg text-green-600">Händler</label>
            </div>
            <div class="flex items-center mb-4">
              <input
                id="checkbox3"
                type="checkbox"
                checked
                @change="handleFileInputChange"
                v-model="checkbox3"
                name="checkbox3"
                class="w-5 h-5 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label for="checkbox3" class="ml-2 text-lg text-yellow-600">
                Interior
              </label>
            </div>
            <div class="flex items-center mb-4">
              <input
                id="checkbox4"
                type="checkbox"
                checked
                @change="handleFileInputChange"
                v-model="checkbox4"
                name="checkbox4"
                class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
              />
              <label for="checkbox4" class="ml-2 text-lg text-purple-600">
                Sonstiges
              </label>
            </div>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
          >
            <button
              data-modal-hide="defaultModal"
              type="button"
              class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Anzeigen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "flowbite";
import { initFlowbite } from "flowbite";
import MapView from "./components/MapView.vue";
import { ref, watchEffect } from "vue";
import { read, utils } from "xlsx";
import { saveAs } from "file-saver";

const headers = ref([]);
const data = ref([]);
const checkbox1 = ref(true);
const checkbox2 = ref(true);
const checkbox3 = ref(true);
const checkbox4 = ref(true);
const fileInput = ref(null);
const selectedFile = ref("fileInput");

const handleFileChange = (event) => {
  let file = fileInput.value.files[0];
  if (selectedFile == null) {
    selectedFile.value = file;
  }
  const reader = new FileReader();

  reader.onload = (e) => {
    const workbook = read(e.target.result, { type: "binary" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = utils.sheet_to_json(worksheet, { header: 1 });

    headers.value = excelData[0];
    // data.value = excelData.slice(1);
    data.value = [];
    let xls_data = excelData.slice(1);
    for (let i = 0; i < xls_data.length; i++) {
      if (checkbox1.value && xls_data[i][3] === "Label") {
        data.value.push(excelData[i]);
      } else if (checkbox2.value && xls_data[i][3] === "Händler") {
        data.value.push(excelData[i]);
      } else if (checkbox3.value && xls_data[i][3] === "Interior") {
        data.value.push(excelData[i]);
      } else if (checkbox4.value && xls_data[i][3] === "Sonstiges") {
        data.value.push(excelData[i]);
      }
    }
    console.log(data.value.length);
  };

  reader.readAsBinaryString(file);
};

const handleFileInputChange = (event) => {
  selectedFile.value = fileInput.value.files[0];
  handleFileChange(event);
};

// watchEffect((event) => {
//   if (!checkbox1.value) {
//     handleFileInputChange(event);
//   }
// else if (checkbox2.checked && label === "Händler") {
//   let rowData = [name, number1, number2, label];
//   lat_long.push(rowData);
// } else if (checkbox3.checked && label === "Interior") {
//   let rowData = [name, number1, number2, label];
//   lat_long.push(rowData);
// } else if (checkbox4.checked && label === "Sonstiges") {
//   let rowData = [name, number1, number2, label];
//   lat_long.push(rowData);
// }
// });
</script>
