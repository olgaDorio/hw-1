const getLightness = (imageData) => {
  const { data } = imageData;
  const range = 3;

  let light = 0;
  let dark = 0;

  const rgba = Array.from({ length: data.length / 4 }, (v, i) => (
    data.slice(i * 4, i * 4 + 4)
  ));

  rgba.forEach((array) => {
    const max = Math.max(...array.slice(0, 3));

    if (max < 128) {
      dark += 1;
    } else {
      light += 1;
    }
  });

  return Math.round((light * 100) / (light + dark));
};

const getImageData = (video, fraction = 1) => {
  const canvas_t = document.createElement('canvas');
  const width = video.videoWidth / fraction;
  const height = video.videoHeight / fraction;

  canvas_t.width = width;
  canvas_t.height = height;

  const ctx_t = canvas_t.getContext('2d');
  ctx_t.drawImage(video, 0, 0, width, height);

  return ctx_t.getImageData(0, 0, width, height);
};
