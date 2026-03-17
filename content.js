const hostname = window.location.hostname;
const musicSites = ['music.youtube.com', 'open.spotify.com', 'soundcloud.com', 'music.apple.com'];
const isMusicSite = musicSites.some(site => hostname.includes(site));
const defaultSpeed = isMusicSite ? 1.0 : 1.5;
const storageKey = `playbackSpeed_${hostname}`;

let currentTargetSpeed = defaultSpeed;

function enforceSpeed(video) {
  if (video.playbackRate !== currentTargetSpeed) {
    video.playbackRate = currentTargetSpeed;
  }
}

function updateAllVideos() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    enforceSpeed(video);
    
    // Attach listeners if not already attached
    if (!video.dataset.speedControllerAttached) {
      video.dataset.speedControllerAttached = 'true';
      
      // Re-enforce speed on common media events where SPAs like YouTube might reset it
      video.addEventListener('loadeddata', () => enforceSpeed(video));
      video.addEventListener('loadedmetadata', () => enforceSpeed(video));
      video.addEventListener('play', () => enforceSpeed(video));
      video.addEventListener('playing', () => enforceSpeed(video));
      video.addEventListener('ratechange', () => enforceSpeed(video));
    }
  });
}

// Function to initialize logic
function init() {
  // Get initial speed from session storage
  chrome.storage.session.get([storageKey], (result) => {
    currentTargetSpeed = result[storageKey] || defaultSpeed;
    updateAllVideos();
  });

  // Listen for changes in session storage
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'session' && changes[storageKey]) {
      currentTargetSpeed = changes[storageKey].newValue;
      updateAllVideos();
    }
  });

  // Use a MutationObserver to catch dynamically added video elements (SPA navigation)
  const observer = new MutationObserver(() => {
    updateAllVideos();
  });

  // Wait for body to be available if script runs early
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
  
  // Fallback for stubborn SPAs like YouTube navigating between videos
  setInterval(updateAllVideos, 1000);
}

// Run init
init();
