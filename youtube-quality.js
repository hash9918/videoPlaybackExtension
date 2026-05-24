window.addEventListener('SetYouTubeQuality', (e) => {
  const quality = e.detail === 'hd2160' ? 'highres' : e.detail;
  const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
  if (player) {
    if (typeof player.setPlaybackQualityRange === 'function') {
      player.setPlaybackQualityRange(quality, quality);
    }
    if (typeof player.setPlaybackQuality === 'function') {
      player.setPlaybackQuality(quality);
    }
  }
});

window.addEventListener('SetYouTubeSpeed', (e) => {
  const speed = e.detail;
  const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
  if (player && typeof player.setPlaybackRate === 'function') {
    player.setPlaybackRate(speed);
  }
});
