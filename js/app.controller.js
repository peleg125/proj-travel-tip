import { locService } from "./services/loc.service.js"
import { mapService } from "./services/map.service.js"

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGoTo = onGoTo
window.onSearch = onSearch

function onInit() {
  mapService
    .initMap()
    .then(() => {
      return mapService.addInfoWindow()
    })
    .then((clickedLatLng) => {
      const { lat, lng } = clickedLatLng
      const name = prompt("Please enter a name")
      locService.addLocation(name, lat, lng)
    })
    .catch(() => console.log("Error: cannot init map"))
}
// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log("Getting Pos")
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  console.log("Adding a marker")
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log("Locations:", locs)
    renderTable(locs)
  })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log("User position is:", pos.coords)
      document.querySelector(
        ".user-pos"
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
    })
    .catch((err) => {
      console.log("err!!!", err)
    })
}

function onPanTo() {
  console.log("Panning the Map")
  mapService.panTo(35.6895, 139.6917)
}

function renderTable(locs) {
  var strHtmls = locs.map((loc) => {
    return `
      <tr>
      <td data-id="${loc.id}">${loc.name}</td>
      <td data-id="${loc.id}">${loc.lat}</td>
      <td data-id="${loc.id}">${loc.lng}</td>
   <td data-id="${loc.id}"><button onclick="onGoTo(${loc.lat}, ${loc.lng})" class="go-to-location"Go To>Go</button><button onclick="onGoTo(${loc.lat}, ${loc.lng})" class="go-to-location"Go To>Delete</button></td>
      </tr>
          `
  })
  const elLocations = document.querySelector(".location-table")
  elLocations.innerHTML += strHtmls.join("")
  elLocations.hidden = false
}
function onGoTo(lat, lng) {
  mapService.panTo(lat, lng)
}

function onSearch(ev) {
  if (ev) ev.preventDefault()
  console.log("test")
  const elInputSearch = document.querySelector("#search-address")
  mapService.getLocationByAddress(elInputSearch.value)
}
