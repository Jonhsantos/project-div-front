const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest(path, { token, responseType, ...options } = {}) {
  if (!baseUrl) {
    throw new ApiError('Configure VITE_API_URL para acessar o servidor.', 0)
  }

  let response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor.', 0)
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    const message = typeof data?.detail === 'string'
      ? data.detail
      : response.status === 422
        ? 'Confira os dados informados.'
        : 'Não foi possível concluir a solicitação.'
    throw new ApiError(message, response.status)
  }
  return responseType === 'blob' ? response.blob() : response.json().catch(() => null)
}
