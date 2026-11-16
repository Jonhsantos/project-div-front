import { apiRequest } from '../../services/api'

export function registerUser({ nome, email, senha, perfil }) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha, perfil }),
  })
}

export function loginUser({ email, senha }) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  })
}

export function getCurrentUser(token) {
  return apiRequest('/auth/me', { token })
}
