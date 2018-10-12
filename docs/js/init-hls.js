const initVideo = (video, url) => {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);

    hls.on(Hls.Events.MEDIA_ATTACHED, function() {
      video.play();
    });

    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
      console.log(data.levels);
    });

    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        switch(data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
        // try to recover network error
          console.log('fatal network error encountered, try to recover');
          hls.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.log('fatal media error encountered, try to recover');
          hls.recoverMediaError();
          break;
        default:
          hls.destroy();
          break;
        }
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.addEventListener('loadedmetadata', function() {
      video.play();
    });
  }
}