
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const TOKEN_KEY = "xclone_token";
const USER_KEY = "xclone_user";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "No se pudo completar la solicitud.");
  }
  return data;
}

export async function requestLoginCode(identifier, profile = {}) {
  try {
    const response = await fetch(`${API_URL}/api/auth/request-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: identifier.trim(), ...profile }),
    });
    return await parseResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("No se pudo conectar con el backend. Verifica que esté ejecutándose en el puerto 8080.", { cause: error });
    }
    throw error;
  }
}

export async function login({ identifier, code }) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: identifier.trim(), code: code.trim() }),
    });
    const data = await parseResponse(response);
    if (!data.token || !data.user) {
      throw new Error("El backend no devolvió una sesión válida.");
    }
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "No se pudo conectar con el backend. Verifica que esté ejecutándose en el puerto 8080.",
        { cause: error }
      );
    }
    throw error;
  }
}

export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token && token.trim() ? token.trim() : null;
}

export function getStoredUser() {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) {
    return null;
  }
  try {
    return JSON.parse(stored);
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
