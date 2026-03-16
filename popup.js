document.addEventListener('DOMContentLoaded', async () => {
  const buttons = document.querySelectorAll('.speed-btn');

  // Load current speed from session state, defaulting to 1.5
  chrome.storage.session.get(['playbackSpeed'], (result) => {
    const currentSpeed = result.playbackSpeed || 1.5;
    updateActiveButton(currentSpeed);
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const speed = parseFloat(btn.getAttribute('data-speed'));
      
      // Save the new speed to session storage
      chrome.storage.session.set({ playbackSpeed: speed }, () => {
        updateActiveButton(speed);
      });
    });
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
