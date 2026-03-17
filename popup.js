document.addEventListener('DOMContentLoaded', async () => {
  const speedButtons = document.querySelectorAll('.option-btn[data-type="speed"]');
  const qualityButtons = document.querySelectorAll('.option-btn[data-type="quality"]');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    
    try {
      const url = new URL(tabs[0].url);
      const hostname = url.hostname;
      const musicSites = ['music.youtube.com', 'open.spotify.com', 'soundcloud.com', 'music.apple.com'];
      const isMusicSite = musicSites.some(site => hostname.includes(site));
      const defaultSpeed = isMusicSite ? 1.0 : 1.5;
      const storageKey = `playbackSpeed_${hostname}`;

      // Load current states from session state
      chrome.storage.session.get([storageKey, 'videoQuality'], (result) => {
        const currentSpeed = result[storageKey] || defaultSpeed;
        const currentQuality = result.videoQuality || 'hd720';
        
        updateActiveButton(speedButtons, currentSpeed);
        updateActiveButton(qualityButtons, currentQuality);
      });

      // Handle speed button clicks
      speedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const speed = parseFloat(btn.getAttribute('data-value'));
          chrome.storage.session.set({ [storageKey]: speed }, () => {
            updateActiveButton(speedButtons, speed);
          });
        });
      });
    } catch (e) {
      // Fallback if URL is invalid (e.g., chrome://)
      chrome.storage.session.get(['playbackSpeed_default', 'videoQuality'], (result) => {
        const currentSpeed = result.playbackSpeed_default || 1.5;
        const currentQuality = result.videoQuality || 'hd720';
        updateActiveButton(speedButtons, currentSpeed);
        updateActiveButton(qualityButtons, currentQuality);
      });

      // Handle speed button clicks fallback
      speedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const speed = parseFloat(btn.getAttribute('data-value'));
          chrome.storage.session.set({ playbackSpeed_default: speed }, () => {
            updateActiveButton(speedButtons, speed);
          });
        });
      });
    }
  });

  // Handle quality button clicks
  qualityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const quality = btn.getAttribute('data-value');
      chrome.storage.session.set({ videoQuality: quality }, () => {
        updateActiveButton(qualityButtons, quality);
      });
    });
  });

  function updateActiveButton(buttons, activeValue) {
    buttons.forEach(btn => {
      const btnValue = btn.getAttribute('data-value');
      // Coerce comparison so numeric strings match numbers (for speed)
      if (btnValue == activeValue) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
});
