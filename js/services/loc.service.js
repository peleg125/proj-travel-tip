export const locService = {
  getLocs,
  addLocation,
  updateLocation,
  deleteLocation,
  getLocations,
  getLocationById,
}
import { utilsService } from "./utils.service.js"
import { storageService } from "./async-storage.service.js"

const API_KEY = "AIzaSyAtf75eiyH_FG5ADvX6NtWkcLWFTMhr230"

const locs = [
  { id: 12345, name: "Greatplace", lat: 32.047104, lng: 34.832384 },
  { id: 123456, name: "Neveragain", lat: 32.047201, lng: 34.832581 },
]

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs)
    }, 2000)
  })
}

const ENTITY_TYPE = "locations"

function addLocation({ name, lat, lng }) {
  const location = {
    id: utilsService.makeId(),
    name,
    lat,
    lng,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locs.push({ id, name, lat, lng, createdAt, updatedAt })
  return storageService.post(ENTITY_TYPE, location)
}

function updateLocation(updatedLocation) {
  updatedLocation.updatedAt = new Date()
  return storageService.put(ENTITY_TYPE, updatedLocation)
}

function deleteLocation(id) {
  return storageService.remove(ENTITY_TYPE, id)
}

function getLocations() {
  return storageService.query(ENTITY_TYPE)
}

function getLocationById(id) {
  return storageService.get(ENTITY_TYPE, id)
}
