# Video Playback Speed Controller

A Chrome extension that allows you to control the playback speed of HTML5 videos across all websites. It enforces a default speed of 1.5x and supports single-page applications (SPAs) like YouTube natively.

## Features
- **Session-based Default**: Video playbacks default to 1.5x speed.
- **Dynamic UI Control**: A modern popup interface allowing you to switch between 0.5x, 1.0x, 1.5x, and 2.0x speeds.
- **Real-time Updates**: Real-time speed updating across all active tabs without requiring a refresh.
- **SPA Support**: Dynamically loaded videos (e.g., YouTube navigations) are automatically caught and the session's active playback speed is enforced.
- **Session Volatility**: The speed resets to 1.5x automatically upon a full browser restart.

## Installation

### For Users (Developer Mode)
1. Clone this repository or download the source code as a ZIP file.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked** in the top left corner.
5. Select the directory containing the extension files.

## Usage
Once installed, any video you open will automatically play at 1.5x speed. 
Click the extension icon in your Chrome toolbar to quickly adjust the speed for the current session.

## Files
- `manifest.json`: The standard Chrome Extension manifest file (V3).
- `background.js`: Service worker to handle session storage permissions.
- `content.js`: The script injected into web pages to enforce playback speeds.
- `popup.html`, `popup.css`, `popup.js`: The user interface for the extension.
