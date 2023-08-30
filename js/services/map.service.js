export const mapService = {
	initMap,
	addMarker,
	panTo,
	addInfoWindow,
}

//
// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
	console.log("InitMap")
	return _connectGoogleApi().then(() => {
		console.log("google available")
		gMap = new google.maps.Map(document.querySelector("#map"), {
			center: { lat, lng },
			zoom: 15,
		})
		console.log("Map!", gMap)
	})
}

function addMarker(loc) {
	var marker = new google.maps.Marker({
		position: loc,
		map: gMap,
		title: "Hello World!",
	})
	return marker
}

function panTo(lat, lng) {
	var laLatLng = new google.maps.LatLng(lat, lng)
	gMap.panTo(laLatLng)
}

//hi
function _connectGoogleApi() {
	if (window.google) return Promise.resolve()
	const API_KEY = "AIzaSyAtf75eiyH_FG5ADvX6NtWkcLWFTMhr230"
	var elGoogleApi = document.createElement("script")
	elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
	elGoogleApi.async = true
	document.body.append(elGoogleApi)

	return new Promise((resolve, reject) => {
		elGoogleApi.onload = resolve
		elGoogleApi.onerror = () => reject("Google script failed to load")
	})
}
function addInfoWindow() {
	return new Promise((resolve, reject) => {
		let infoWindow = new google.maps.InfoWindow({
			content: "Click the map to get Lat/Lng!",
			position: gMap.getCenter(),
		})

		infoWindow.open(gMap)

		gMap.addListener("click", (mapsMouseEvent) => {
			infoWindow.close()

			infoWindow = new google.maps.InfoWindow({
				position: mapsMouseEvent.latLng,
			})
			infoWindow.setContent(
				JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
			)
			infoWindow.open(gMap)
			console.log("latlng.tojson", mapsMouseEvent.latLng.toJSON())
			resolve(mapsMouseEvent.latLng.toJSON())
		})
	})
}
