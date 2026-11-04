
import { apiRequest } from "./apiClient";

export function followUser(username) {
  return apiRequest("/api/follows", {
    method: "POST",
    body: JSON.stringify({ username: username.replace("@", "") }),
  });
}

export function unfollowUser(username) {
  return apiRequest(`/api/follows/${username.replace("@", "")}`, {
    method: "DELETE",
  });
}
