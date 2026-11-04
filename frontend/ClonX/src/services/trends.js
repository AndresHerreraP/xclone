import { apiRequest } from "./apiClient";

export async function getTrends() {
  const data = await apiRequest("/api/trends");
  return data.items;
}
