
import { apiRequest } from "./apiClient";
import { toApiPage, toUiPage } from "../utils/helpers";

export function getProfile(username) {
  return apiRequest(`/api/users/${username}`);
}

export async function getUsers(query = "") {
  const data = await apiRequest(`/api/users?query=${encodeURIComponent(query)}`);
  return data.items;
}

export async function getFollowers(username, page) {
  const data = await apiRequest(
    `/api/users/${username}/followers?page=${toApiPage(page)}&size=10`
  );
  return { ...data, page: toUiPage(data.page) };
}

export async function getFollowing(username, page) {
  const data = await apiRequest(
    `/api/users/${username}/following?page=${toApiPage(page)}&size=10`
  );
  return { ...data, page: toUiPage(data.page) };
}
