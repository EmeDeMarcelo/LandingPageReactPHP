// src/lib/api.js
const API_URL = import.meta.env.VITE_API_URL

export const apiFetch = async (url, options = {}) => {
  const response = await fetch(API_URL + url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  // // 🔐 Si no está autenticado → login
  // if (response.status === 401) {
  //   if (window.location.pathname !== '/login') {
  //     window.location.href = '/login'
  //   }
  //   return
  // }

  if (response.status === 401) {
  // SOLO redirigir si estamos en admin
  if (window.location.pathname.startsWith("/admin")) {
    window.location.href = "/login";
  }
  return null;
}


  // ❌ Error genérico del backend
  if (!response.ok) {
    throw new Error(
      data?.error ||
      data?.message ||
      'Error inesperado del servidor'
    )
  }

  return data
}

// Función para POST
export const apiPost = async (url, body) => {
  return apiFetch(url, {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

// Función para PUT
export const apiPut = async (url, body) => {
  return apiFetch(url, {
    method: 'PUT',
    body: JSON.stringify(body)
  })
}

// Función para DELETE
export const apiDelete = async (url) => {
  return apiFetch(url, {
    method: 'DELETE'
  })
}
