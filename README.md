<div align="center">

<img src="icons/lingua128.png" alt="Lingua logo" width="128">

# Lingua

### Understand the web, one word at a time.

Translate words while browsing. Hover to see a translation, or double-click to open the quick translator.

</div>

---

## What is Lingua?

Lingua is a browser extension designed to make reading in another language easier.

It was created to solve a simple everyday problem: stopping your reading to copy an unfamiliar word, open a translation website, and then return to the original page.

Lingua aims to make this process faster and more convenient.

## The problem Lingua solves

When reading a webpage in another language, looking up unfamiliar words can interrupt your concentration.

Traditional translation workflows often require several steps:

1. Select and copy a word.
2. Open a separate translation service.
3. Paste the word and get the translation.
4. Return to the original webpage.

Lingua brings quick translation closer to where you are reading.

## Main features

- **Hover translation:** Get help translating words while browsing.
- **Quick translator:** Double-click to open the translation interface.
- **Language settings:** Choose your source and target languages.
- **Automatic detection:** Choose automatic source-language detection where supported.
- **Simple workflow:** Spend less time switching between webpages and translation tools.

Features and supported languages depend on the current implementation and translation service.

## Who is Lingua for?

Lingua may be useful for:

- People learning English or another language.
- People reading websites in a foreign language.
- Students and researchers.
- People who regularly encounter unfamiliar words online.
- Anyone who wants a convenient way to translate text while browsing.

## How does it work?

Lingua is built with JavaScript, HTML, CSS, and the Chrome Extensions API.

The extension uses Manifest V3 and sends translation requests to the MyMemory Translation API.

At a high level:

1. The extension detects a translation interaction on a webpage.
2. JavaScript handles the interaction or opens the quick translator.
3. The background service worker processes the translation request.
4. The request is sent to the translation service.
5. The result is returned to the extension and displayed to the user.

## Project structure

```text
Utility-lingua/
├── brand/
├── icons/
│   └── lingua128.png
├── background.js
├── content.js
├── quick-translate.js
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
└── README.md
```

### Main files

| File or folder | Purpose |
| --- | --- |
| `manifest.json` | Extension configuration, permissions, and script declarations |
| `background.js` | Handles translation requests |
| `content.js` | Handles translation interactions on webpages |
| `quick-translate.js` | Implements the quick translator |
| `popup.html` | Popup interface structure |
| `popup.css` | Popup styling |
| `popup.js` | Popup settings and language preferences |
| `icons/` | Extension icons |
| `brand/` | Branding assets |
| `README.md` | Project documentation |

## Install for local testing

You can load Lingua locally in Chrome or Edge.

1. Download or clone this repository.
2. Open Chrome and visit `chrome://extensions/`, or open Edge and visit `edge://extensions/`.
3. Turn on **Developer mode**.
4. Select **Load unpacked**.
5. Choose the Lingua project folder containing `manifest.json`.
6. Pin the extension if you want quick access.
7. Open a webpage and test the translation features.

After changing extension code, reload Lingua on the extensions page and refresh the webpage you are testing.

## Privacy and translation service

Lingua uses an external translation service. Text submitted for translation may be sent to MyMemory.

Avoid translating sensitive or confidential text unless you understand and accept the service's data-handling practices.

Before public release, Lingua should have a clear privacy policy and the project should verify the translation API's terms, usage limits, and commercial requirements.

## Development status

Lingua is under active development.

Current priorities include:

- Improving reliability.
- Testing hover and double-click translation.
- Checking language settings.
- Improving error handling and accessibility.
- Preparing documentation and privacy information.
- Listening to feedback from real users.

Future features may be considered based on user needs. Planned features are not necessarily available today.

## Contributing and feedback

Feedback, bug reports, and suggestions are welcome.

Please describe the issue clearly and include steps to reproduce it when reporting a bug.

## License

No open-source licence has been specified yet. Until a licence is added, do not assume that the code may be freely reused or redistributed.

---

<div align="center">

**Lingua — Understand the web, one word at a time.**

Built to make everyday reading easier.

</div>
