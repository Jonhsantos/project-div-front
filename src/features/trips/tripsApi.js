import { apiRequest } from '../../services/api'

export function listTrips(token) {
  return apiRequest('/trips', { token })
}

export function createTrip(token, trip) {
  return apiRequest('/trips', { method: 'POST', token, body: JSON.stringify(trip) })
}

export function joinTrip(token, codigo_acesso) {
  return apiRequest('/trips/join', { method: 'POST', token, body: JSON.stringify({ codigo_acesso }) })
}

export function getTripDetails(token, tripId) {
  return apiRequest(`/trips/${tripId}`, { token })
}

export function closeTrip(token, tripId) {
  return apiRequest(`/trips/${tripId}/close`, { token, method: 'POST' })
}

export function exportTrip(token, tripId) {
  return apiRequest(`/trips/${tripId}/export`, { token, responseType: 'blob' })
}
