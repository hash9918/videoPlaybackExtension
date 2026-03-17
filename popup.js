document.addEventListener('DOMContentLoaded', async () => {
  const buttons = document.querySelectorAll('.speed-btn');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    
    try {
      const url = new URL(tabs[0].url);
      const hostname = url.hostname;
      const musicSites = ['music.youtube.com', 'open.spotify.com', 'soundcloud.com', 'music.apple.com'];
      const isMusicSite = musicSites.some(site => hostname.includes(site));
      const defaultSpeed = isMusicSite ? 1.0 : 1.5;
      const storageKey = `playbackSpeed_${hostname}`;

      // Load current speed from session state
      chrome.storage.session.get([storageKey], (result) => {
        const currentSpeed = result[storageKey] || defaultSpeed;
        updateActiveButton(currentSpeed);
      });

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const speed = parseFloat(btn.getAttribute('data-speed'));
          
          chrome.storage.session.set({ [storageKey]: speed }, () => {
            updateActiveButton(speed);
          });
        });
      });
    } catch (e) {
      // Fallback if URL is invalid (e.g., chrome://)
      chrome.storage.session.get(['playbackSpeed_default'], (result) => {
        const currentSpeed = result.playbackSpeed_default || 1.5;
        updateActiveButton(currentSpeed);
      });

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const speed = parseFloat(btn.getAttribute('data-speed'));
          chrome.storage.session.set({ playbackSpeed_default: speed }, () => {
            updateActiveButton(speed);
          });
        });
      });
    }
  });

  function updateActiveButton(speed) {
    buttons.forEach(btn => {
      if (parseFloat(btn.getAttribute('data-speed')) === speed) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
});
