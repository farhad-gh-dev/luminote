# Luminote

Luminote is a Chrome extension that lets you **select text on any web page to highlight and save it**. Your highlights are stored locally in the browser and re-applied automatically the next time you visit the page, so you can build a personal collection of the passages that matter to you.

## Features

- **Highlight any selection** – Select text on a page and a small floating action appears to save it as a highlight.
- **Right-click to save** – Use the **"Save to Luminote"** context-menu item on any selection.
- **Per-page highlights** – Open the toolbar popup to see every highlight you saved for the current page.
- **Persistent highlights** – Saved highlights are automatically restored and re-drawn when you revisit a page.
- **Search** – Search across your saved highlights by text, page title, or tags.
- **Local-first storage** – Everything is stored on your machine in IndexedDB (via [Dexie](https://dexie.org/)); no account or server required.
- **Delete** – Remove highlights you no longer need from the popup.

## How it works

Luminote is a [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/) extension made up of three parts:

| Part                          | Source               | Role                                                                                                      |
| ----------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------- |
| **Content script**            | `src/content/`       | Detects text selections, renders the in-page highlight UI, and re-applies stored highlights on page load. |
| **Background service worker** | `src/background/`    | Registers the right-click context menu and coordinates messages between the page and the popup.           |
| **Popup (React app)**         | `src/`, `index.html` | Lists, searches, and deletes the highlights for the active tab.                                           |

Highlights are persisted in an IndexedDB database (`LumiNoteDB`) and have the following shape (see `src/types/index.ts`):

```ts
interface Highlight {
  id: string; // uuid
  text: string; // the highlighted text
  url: string; // page the highlight belongs to
  title: string; // page title
  createdAt: string; // ISO timestamp
  tags?: string[];
  color?: string;
  websiteTitle?: string;
  websiteIconUrl?: string;
}
```

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 6](https://vite.dev/) (separate builds for the UI and the content script)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Dexie](https://dexie.org/) for IndexedDB storage
- [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) for the extension APIs

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- Google Chrome (or any Chromium-based browser that supports Manifest V3, e.g. Edge or Brave)

### Install dependencies

```bash
npm install
```

### Build the extension

The build is split into two Vite configs — one for the popup/background and one for the content script. The `build` script runs both and emits everything into the `build/` directory:

```bash
npm run build
```

Useful individual scripts:

| Script                  | Description                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `npm run build`         | Build the full extension (UI + content script) into `build/`.                        |
| `npm run build:ui`      | Build only the popup and background worker.                                          |
| `npm run build:content` | Build only the content script.                                                       |
| `npm run dev`           | Run the popup UI in Vite's dev server (useful for iterating on the UI in isolation). |
| `npm run lint`          | Run ESLint across the project.                                                       |

> The `build/` directory is git-ignored, so you need to run `npm run build` before loading the extension.

## Load the extension unpacked in Chrome

1. Run `npm run build` to generate the `build/` directory.
2. Open `chrome://extensions` in Chrome.
3. Toggle **Developer mode** on (top-right corner).
4. Click **Load unpacked**.
5. Select the **`build/`** folder in this project.
6. Luminote now appears in your toolbar. Pin it for quick access.

After making code changes, re-run `npm run build` and click the **reload** (↻) icon on the Luminote card in `chrome://extensions` to pick them up.

### Loading in other Chromium browsers

- **Microsoft Edge** – Go to `edge://extensions`, enable **Developer mode**, choose **Load unpacked**, and select `build/`.
- **Brave** – Go to `brave://extensions`, enable **Developer mode**, choose **Load unpacked**, and select `build/`.

## Usage

1. Select any text on a web page.
2. Save it either from the floating action that appears, or by right-clicking the selection and choosing **"Save to Luminote"**.
3. Click the Luminote toolbar icon to view, search, and delete the highlights saved for the current page.
4. Revisit the page later — your saved highlights are restored automatically.

## Project structure

```
public/
  manifest.json        # Extension manifest (MV3)
  icons/               # Toolbar/extension icons
src/
  App.tsx              # Popup root component
  background/          # Service worker + context menu + messaging
  content/             # Content script, selection observer, in-page UI
  components/          # Shared UI components
  features/            # Popup and in-page highlight features
  services/            # Dexie database + highlight/chrome API services
  types/               # Shared TypeScript types
  constants/           # Message actions, menu/storage keys
vite.ui.config.ts      # Build config for popup + background
vite.content.config.ts # Build config for the content script
```

## Permissions

Luminote requests the following permissions (declared in `public/manifest.json`):

- `activeTab`, `tabs` – read the URL/title of the page you're highlighting.
- `scripting` – inject the highlight UI into pages.
- `storage` – store extension data.
- `contextMenus` – add the "Save to Luminote" right-click menu.
- Host access (`<all_urls>`) – so highlights work on any site.
