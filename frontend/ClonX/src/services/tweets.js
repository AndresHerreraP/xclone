
import { apiRequest } from "./apiClient";
import { toApiPage, toUiPage } from "../utils/helpers";

export function publishTweet(content) {
  return apiRequest("/api/tweets", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function getFeed(page) {
  const data = await apiRequest(`/api/feed?page=${toApiPage(page)}&size=10`);
  return { ...data, page: toUiPage(data.page) };
}

export async function getUserTweets(username, page) {
  const data = await apiRequest(
    `/api/users/${username}/tweets?page=${toApiPage(page)}&size=10`
  );
  return { ...data, page: toUiPage(data.page) };
}

export function likeTweet(tweetId) {
  return apiRequest(`/api/tweets/${tweetId}/like`, { method: "POST" });
}

export function repostTweet(tweetId) {
  return apiRequest(`/api/tweets/${tweetId}/repost`, { method: "POST" });
}
