let currentTargetSpeed = 1.5;
let currentTargetQuality = 'hd720';

function enforceSpeed(video) {
  if (video.playbackRate !== currentTargetSpeed) {
    video.playbackRate = currentTargetSpeed;
  }
}

// Function to inject YouTube specific quality logic
function enforceYouTubeQuality() {
  if (!window.location.hostname.includes("youtube.com")) return;
  
  // We must inject a script into the main page context to access the YouTube player API
  const scriptContent = `
    (function() {
      const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
      if (player && typeof player.setPlaybackQualityRange === 'function') {
        player.setPlaybackQualityRange('${currentTargetQuality}');
        // older players might use setPlaybackQuality
        if (typeof player.setPlaybackQuality === 'function') {
           player.setPlaybackQuality('${currentTargetQuality}');
        }
      }
    })();
  `;

  const scriptElement = document.createElement('script');
  scriptElement.textContent = scriptContent;
  (document.head || document.documentElement).appendChild(scriptElement);
  scriptElement.remove(); // Clean up immediately after execution
}

function updateAllVideos() {
  enforceYouTubeQuality();

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
  // Get initial speed and quality from session storage
  chrome.storage.session.get(['playbackSpeed', 'videoQuality'], (result) => {
    currentTargetSpeed = result.playbackSpeed || 1.5;
    currentTargetQuality = result.videoQuality || 'hd720';
    updateAllVideos();
  });

  // Listen for changes in session storage
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'session') {
      let requiresUpdate = false;
      
      if (changes.playbackSpeed) {
        currentTargetSpeed = changes.playbackSpeed.newValue;
        requiresUpdate = true;
      }
      
      if (changes.videoQuality) {
        currentTargetQuality = changes.videoQuality.newValue;
        requiresUpdate = true;
      }
      
      if (requiresUpdate) {
          updateAllVideos();
      }
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
