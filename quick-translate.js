(() => {
  if (window.__utilityLinguaQuickTranslateLoaded) return;
  window.__utilityLinguaQuickTranslateLoaded = true;

  let popup = null;
  let input = null;
  let result = null;
  let timer = null;
  let requestId = 0;

  function createPopup() {
    if (popup) return;

    popup = document.createElement("div");

    Object.assign(popup.style, {
      position: "fixed",
      zIndex: "2147483647",
      display: "none",
      width: "300px",
      padding: "16px",
      boxSizing: "border-box",
      background: "#ffffff",
      color: "#17201d",
      border: "1px solid #d9e1dd",
      borderRadius: "14px",
      boxShadow: "0 10px 35px rgba(0,0,0,.20)",
      font: "14px/1.5 system-ui, sans-serif"
    });

    const header = document.createElement("div");
    header.textContent = "Utility Lingua";
    Object.assign(header.style, {
      fontSize: "17px",
      fontWeight: "700",
      marginBottom: "10px"
    });

    const label = document.createElement("label");
    label.textContent = "Spanish → English";
    Object.assign(label.style, {
      display: "block",
      marginBottom: "6px",
      fontSize: "12px",
      color: "#58635e"
    });

    input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Write a Spanish word or phrase...";
    input.autocomplete = "off";

    Object.assign(input.style, {
      width: "100%",
      boxSizing: "border-box",
      padding: "10px",
      border: "1px solid #cbd5d0",
      borderRadius: "8px",
      font: "inherit",
      color: "#ffb950",
      background: "#ffffff",
      outlineOffset: "2px"
    });

    const translateButton = document.createElement("button");
    translateButton.type = "button";
    translateButton.textContent = "Translate";

    Object.assign(translateButton.style, {
      marginTop: "9px",
      padding: "8px 12px",
      border: "0",
      borderRadius: "8px",
      background: "#ffb950",
      color: "#ffffff",
      font: "inherit",
      fontWeight: "600",
      cursor: "pointer"
    });

    result = document.createElement("div");
    result.setAttribute("aria-live", "polite");

    Object.assign(result.style, {
      marginTop: "12px",
      overflowWrap: "anywhere"
    });

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.textContent = "Copy translation";

    Object.assign(copyButton.style, {
      display: "none",
      marginTop: "8px",
      padding: "7px 10px",
      border: "1px solid #cbd5d0",
      borderRadius: "8px",
      background: "#f4f7f5",
      color: "#17201d",
      font: "inherit",
      cursor: "pointer"
    });

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close translator");

    Object.assign(closeButton.style, {
      position: "absolute",
      top: "10px",
      right: "12px",
      border: "0",
      background: "transparent",
      color: "#58635e",
      fontSize: "22px",
      cursor: "pointer"
    });

    closeButton.addEventListener("click", closePopup);

    translateButton.addEventListener("click", translate);
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        translate();
      }

      if (event.key === "Escape") {
        closePopup();
      }
    });

    copyButton.addEventListener("click", async () => {
      const text = result.dataset.translation;
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        copyButton.textContent = "Copied!";
      } catch {
        copyButton.textContent = "Copy unavailable";
      }
    });

    popup.append(
      header,
      closeButton,
      label,
      input,
      translateButton,
      result,
      copyButton
    );

    popup._copyButton = copyButton;
    popup._translateButton = translateButton;

    document.documentElement.appendChild(popup);
  }

  function openPopup(x, y) {
    createPopup();

    const margin = 10;
    const width = 300;
    const estimatedHeight = 240;

    popup.style.display = "block";
    popup.style.left = Math.max(
      margin,
      Math.min(x, window.innerWidth - width - margin)
    ) + "px";

    popup.style.top = Math.max(
      margin,
      Math.min(y, window.innerHeight - estimatedHeight - margin)
    ) + "px";

    input.value = "";
    result.textContent = "";
    delete result.dataset.translation;
    popup._copyButton.style.display = "none";
    popup._copyButton.textContent = "Copy translation";
    input.focus();
  }

  function closePopup() {
    if (popup) popup.style.display = "none";
    clearTimeout(timer);
    requestId++;
  }

  function translate() {
    const phrase = input.value.trim();
    if (!phrase) {
      result.textContent = "Please enter a Spanish word or phrase.";
      return;
    }

    const currentRequest = ++requestId;

    result.textContent = "Translating...";
    delete result.dataset.translation;
    popup._copyButton.style.display = "none";

    chrome.runtime.sendMessage(
      {
        type: "translate",
        word: phrase,
        langpair: "es|en"
      },
      response => {
        if (currentRequest !== requestId || popup.style.display === "none") {
          return;
        }

        if (chrome.runtime.lastError || !response?.translation) {
          result.textContent =
            response?.error || "Translation unavailable. Try again later.";
          return;
        }

        result.textContent = response.translation;
        result.dataset.translation = response.translation;
        popup._copyButton.style.display = "inline-block";
      }
    );
  }

  document.addEventListener("dblclick", event => {
    // Don't interfere with typing, editing, links, or selecting page text.
    if (event.target.closest(
      "input, textarea, select, button, a, [contenteditable='true'], [role='textbox']"
    )) {
      return;
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      openPopup(event.clientX, event.clientY);
    }, 80);
  }, true);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closePopup();
  });

  document.addEventListener("mousedown", event => {
    if (popup && popup.style.display !== "none" &&
        !popup.contains(event.target)) {
      closePopup();
    }
  });

  window.addEventListener("scroll", closePopup, true);
})();
