

export function toApiPage(uiPage) {
  return uiPage < 1 ? 1 : uiPage;
}

export function toUiPage(apiPage) {
  return apiPage < 1 ? 1 : apiPage;
}

export function formatTweetDate(value) {
  return new Date(value).toLocaleString("es-CO");
}
