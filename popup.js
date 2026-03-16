document.addEventListener('DOMContentLoaded', async () => {
  const speedButtons = document.querySelectorAll('.option-btn[data-type="speed"]');
  const qualityButtons = document.querySelectorAll('.option-btn[data-type="quality"]');

  // Load current states from session state
  chrome.storage.session.get(['playbackSpeed', 'videoQuality'], (result) => {
    const currentSpeed = result.playbackSpeed || 1.5;
    const currentQuality = result.videoQuality || 'hd720';
    
    updateActiveButton(speedButtons, currentSpeed);
    updateActiveButton(qualityButtons, currentQuality);
  });

  // Handle speed button clicks
  speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const speed = parseFloat(btn.getAttribute('data-value'));
      chrome.storage.session.set({ playbackSpeed: speed }, () => {
        updateActiveButton(speedButtons, speed);
      });
    });
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
