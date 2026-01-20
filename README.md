# Apify Console Opener Extension

A Chrome extension that opens the Apify actor input page and sets up for further interaction.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right.
3. Click "Load unpacked" and select the folder containing these files (`c:\Users\krish\Desktop\CS\leadAutomater`).
4. The extension should now be loaded.

## Usage

- Click the extension icon in the toolbar to open the popup.
- Click the "Open Apify Input Page" button to open the specified URL in a new tab.
- The content script will load on the page, allowing for DOM interactions.

## Further Interaction

The `content.js` script is injected into the page and provides functions like `fillInput(selector, value)` to manipulate form elements. You can extend this script to add more interactions as needed.

## Troubleshooting

- Ensure the manifest.json is valid.
- Check the console for any errors when loading the extension or opening the page.