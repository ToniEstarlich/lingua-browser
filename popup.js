const source = document.getElementById("source");
const target = document.getElementById("target");
const save = document.getElementById("save");
const status = document.getElementById("status");

chrome.storage.local.get(
  { sourceLanguage: "en", targetLanguage: "es" },
  settings => {
    source.value = settings.sourceLanguage;
    target.value = settings.targetLanguage;
  }
);

save.addEventListener("click", () => {
  if (source.value !== "auto" && source.value === target.value) {
    status.textContent = "Choose different languages or use Auto-detect.";
    return;
  }

  chrome.storage.local.set({
    sourceLanguage: source.value,
    targetLanguage: target.value
  }, () => {
    status.textContent = "Languages saved!";
  });
});
