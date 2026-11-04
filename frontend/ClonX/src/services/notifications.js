import { apiRequest } from "./apiClient";
import { toApiPage, toUiPage } from "../utils/helpers";

export async function getNotifications(page = 1) {
  const data = await apiRequest(`/api/notifications?page=${toApiPage(page)}&size=10`);
  return { ...data, page: toUiPage(data.page) };
}
