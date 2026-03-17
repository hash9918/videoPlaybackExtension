# Video Playback Speed & Quality Controller

A Chrome extension that allows you to control the playback speed of HTML5 videos across all websites, plus control the streaming quality specifically on YouTube. It enforces a default speed of 1.5x and a default YouTube quality of 720p, while deeply supporting single-page applications (SPAs) natively.

## Features
- **Session-based Default**: Video playbacks default to 1.5x speed on most sites, but correctly default to 1.0x on popular music streaming sites (YouTube Music, Spotify, SoundCloud, Apple Music). YouTube default quality is 720p.
- **Dynamic UI Control**: A modern popup interface allowing you to switch between 0.5x, 1.0x, 1.5x, and 2.0x speeds, and Auto, 480p, 720p, and 1080p qualities. All speed settings are saved completely independently per-hostname.
- **Real-time Updates**: Real-time speed updating across all active tabs without requiring a refresh. Quality updates seamlessly switch the active YouTube player stream.
- **SPA Support**: Dynamically loaded videos (e.g., YouTube navigations) are automatically caught and the session's active playback settings are strictly enforced.
- **Session Volatility**: The settings reset to their defaults automatically upon a full browser restart.

## Installation

### For Users (Developer Mode)
1. Clone this repository or download the source code as a ZIP file.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked** in the top left corner.
5. Select the directory containing the extension files.

## Usage
Once installed, any video you open will automatically play at 1.5x speed (or 1.0x on music streaming sites), and YouTube videos will launch in 720p. 
Click the extension icon in your Chrome toolbar to quickly adjust the speed and quality for the current session. Your speed preference is saved on a per-site basis, meaning changing the speed on a music site won't affect your regular video streaming elsewhere.

## Files
- `manifest.json`: The standard Chrome Extension manifest file (V3).
- `background.js`: Service worker to handle session storage permissions.
- `content.js`: The script injected into web pages to enforce playback speeds and YouTube quality via player API.
- `popup.html`, `popup.css`, `popup.js`: The user interface for the extension.
