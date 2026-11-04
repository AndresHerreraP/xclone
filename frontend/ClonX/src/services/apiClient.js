import { clearSession, getToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (!token) {
    clearSession();
    throw new Error("No hay una sesión activa. Vuelve a iniciar sesión.");
  }
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 401) {
    clearSession();
    window.dispatchEvent(new Event("xclone:unauthorized"));
    if (window.location.pathname !== "/login") window.location.assign("/login");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "No se pudo completar la solicitud.");
  return data;
}
