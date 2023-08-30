import { locService } from "./services/loc.service.js"
import { mapService } from "./services/map.service.js"

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGoTo = onGoTo
window.onSearch = onSearch
window.onDelete = onDelete
window.onCopyLink = onCopyLink

function onInit() {
  const urlParams = new URLSearchParams(window.location.search)
  const lat = +urlParams.get("lat") || 32.0749831
  const lng = +urlParams.get("lng") || 34.9120554
  console.log(urlParams, lat, lng)

  mapService
    .initMap(lat, lng, onMapClick)
    .then(() => {
      return mapService.addInfoWindow()
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
  locService.getLocations().then((locs) => {
    if (locs && locs.length > 0) {
      console.log("from onGetLocs, getlocationsfromDB", locs)
      renderTable(locs)
    } else {
      locService.getLocs().then((locs) => {
        console.log("fromgetLocs, not from DB", locs)
        renderTable(locs)
      })
    }
  })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log("User position is:", pos.coords)
      document.querySelector(
        ".user-pos"
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
      mapService.panTo(pos.coords.latitude, pos.coords.longitude)
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
        <td>${loc.name}</td>
        <td>${loc.lat}</td>
        <td>${loc.lng}</td>
        <td><button onclick="onGoTo(${loc.lat}, ${loc.lng})" class="go-to-location">Go</button>
        <button onclick="onDelete('${loc.id}')" class="del-btn">Delete</button></td>
        </tr>`
  })
  const elLocations = document.querySelector(".location-table")
  elLocations.innerHTML = strHtmls.join("")
  elLocations.hidden = false
}

function onGoTo(lat, lng) {
  mapService.panTo(lat, lng)
}

function onSearch(ev) {
  if (ev) ev.preventDefault()
  const elInputSearch = document.querySelector("#search-address")
  console.log(ev)
  console.log("test")
  mapService.getLocationByAddress(elInputSearch.value).then((location) => {
    console.log(location)
    locService
      .addLocation({
        name: location.address,
        lat: location.lat,
        lng: location.lng,
      })
      .then((value) => {
        console.log(value)
      })
  })
}

function onMapClick(clickedLatLng) {
  const { lat, lng } = clickedLatLng
  const name = prompt("Please enter a name")
  if (name) {
    locService
      .addLocation({ name, lat, lng })
      .then((locationData) => {
        console.log("Location added successfully:", locationData)
      })
      .catch((error) => {
        console.error("Failed to add location:", error)
      })
  }
}

function onDelete(id) {
  locService
    .deleteLocation(id)
    .then(() => {
      return locService.getLocations()
    })
    .then((locs) => {
      renderTable(locs)
    })
    .catch((error) => {
      console.error("Operation failed:", error)
    })
}

function onCopyLink() {
  getPosition()
    .then(
      (pos) =>
        `https://peleg125.github.io/proj-travel-tip/index.html?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
    )
    .then((url) => navigator.clipboard.writeText(url))
    .then(() => {
      alert("Link copied to clipboard")
    })
    .catch((err) => {
      console.error("Could not complete operation: ", err)
    })
}
