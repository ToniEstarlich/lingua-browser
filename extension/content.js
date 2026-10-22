(() => {
  if (window.__utilityLinguaLoaded) return;
  window.__utilityLinguaLoaded = true;

  const dictionary = {
    hello: "hola",
    although: "aunque",
    however: "sin embargo",
    nevertheless: "no obstante",
    eventually: "finalmente",
    improve: "mejorar",
    achieve: "lograr",
    though: "aunque",
    purpose: "propósito",
    through: "a través de",
    understanding: "comprensión",
    language: "idioma",
    knowledge: "conocimiento",
    beautiful: "hermoso",
    challenge: "desafío",
    experience: "experiencia",
    learning: "aprendizaje",
    freedom: "libertad",
    world: "mundo"
  };

  const cache = new Map();
  const popup = document.createElement("div");

  Object.assign(popup.style, {
    position: "fixed",
    zIndex: "2147483647",
    display: "none",
    pointerEvents: "none",
    padding: "10px 13px",
    background: "#EDF1F0",
    color: "#1e2523",
    border: "1px solid rgba(255, 177, 81, 0.12)",
    borderRadius: "12px",
    boxShadow: "0 8px 28px rgba(17,22,21,.14)",
    font: "13px/1.45 system-ui, sans-serif",
    maxWidth: "260px"
  });

  document.documentElement.appendChild(popup);

  let lastWord = "";
  let timer;

  function getWordAt(x, y) {
    let range;

    if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(x, y);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      }
    } else if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y);
    }

    if (!range || range.startContainer.nodeType !== 3) return "";

    const text = range.startContainer.textContent || "";
    const offset = range.startOffset;
    const words = /[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*/gu;

    for (const match of text.matchAll(words)) {
      const start = match.index;
      const end = start + match[0].length;
      if (offset >= start && offset < end) return match[0];
    }

    return "";
  }

  function positionPopup(x, y) {
    popup.style.left = Math.max(
      8, Math.min(x + 14, window.innerWidth - 280)
    ) + "px";

    popup.style.top = Math.max(
      8, Math.min(y + 16, window.innerHeight - 80)
    ) + "px";
  }

  function show(word, message, muted = false) {
    popup.replaceChildren();

    const heading = document.createElement("div");
    heading.textContent = word;
    heading.style.fontWeight = "700";
    heading.style.marginBottom = "3px";

    const result = document.createElement("div");
    result.textContent = message;
    result.style.color = muted ? "#4F5855" : "#ffb950";

    popup.append(heading, result);
    popup.style.display = "block";
  }

  function hide() {
    popup.style.display = "none";
    lastWord = "";
  }

  document.addEventListener("mousemove", event => {
    clearTimeout(timer);

    const x = event.clientX;
    const y = event.clientY;

    timer = setTimeout(() => {
      const word = getWordAt(x, y);

      if (!word) {
        hide();
        return;
      }

      const key = word.toLocaleLowerCase();

      if (key === lastWord && popup.style.display === "block") {
        positionPopup(x, y);
        return;
      }

      lastWord = key;
      positionPopup(x, y);

      if (dictionary[key]) {
        show(word, dictionary[key]);
        return;
      }

      if (cache.has(key)) {
        show(word, cache.get(key), cache.get(key).startsWith("Translation unavailable"));
        return;
      }

      show(word, "Traduciendo…", true);

      chrome.runtime.sendMessage(
        { type: "translate", word },
        response => {
          if (chrome.runtime.lastError) {
            cache.set(key, "Translation unavailable. Try again later.");
          } else if (response?.translation) {
            cache.set(key, response.translation);
          } else {
            cache.set(
              key,
              response?.error || "Translation unavailable. Try again later."
            );
          }

          if (lastWord === key && popup.style.display === "block") {
            const translation = cache.get(key);
            show(
              word,
              translation,
              translation.startsWith("Translation unavailable")
            );
          }
        }
      );
    }, 150);
  });

  document.addEventListener("scroll", hide, true);
})();
