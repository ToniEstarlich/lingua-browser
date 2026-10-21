chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "translate" || typeof message.word !== "string") {
    return;
  }

  const langpair =
    message.langpair === "es|en" ? "es|en" : "en|es";

  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", message.word);
  url.searchParams.set("langpair", langpair);

  fetch(url.toString())
    .then(response => {
      if (!response.ok) throw new Error("Translation request failed");
      return response.json();
    })
    .then(data => {
      const translation = data.responseData?.translatedText;

      if (data.responseStatus !== 200 || !translation) {
        throw new Error("No translation found");
      }

      sendResponse({ translation });
    })
    .catch(() => {
      sendResponse({
        error: "Translation unavailable. Try again later."
      });
    });

  return true;
});