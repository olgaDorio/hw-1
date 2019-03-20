declare var Hls: any;

export default (video: HTMLVideoElement, url: string) => {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      video.play();
    });

    hls.on(Hls.Events.ERROR, (event: {}, data: { fatal?: Boolean, type?: string }) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
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
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  }
};
