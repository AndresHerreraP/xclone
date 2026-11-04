
import { apiRequest } from "./apiClient";

export function followUser(username) {
  return apiRequest("/api/follows", {
    method: "POST",
    body: JSON.stringify({ username: username.replace("@", "") }),
  });
}

export function unfollowUser(username) {
  const normalizedUsername = username.trim().replace(/^@/, "");
  return apiRequest(`/api/follows/${encodeURIComponent(normalizedUsername)}`, {
    method: "DELETE",
  });
}
