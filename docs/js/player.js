var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("slider", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Slider {
        constructor(slider, onChange) {
            this.slider = slider;
            this.circle = slider.querySelector('.circle');
            this.radius = this.circle.offsetWidth / 2;
            this.onChange = onChange;
            this.name = slider.dataset.name || '';
            this.minValue = Number(slider.dataset.min) || 0;
            this.maxValue = Number(slider.dataset.max) || 1;
            this.down = false;
            this.diff = 0;
            this.min = 0;
            this.slider.addEventListener('touchstart', this.start.bind(this));
            this.slider.addEventListener('mousedown', this.start.bind(this));
            document.addEventListener('mouseup', this.stop.bind(this));
            document.addEventListener('touchend', this.stop.bind(this));
            document.addEventListener('touchmove', this.move.bind(this));
            document.addEventListener('mousemove', this.move.bind(this));
            this.setValue(Number(slider.dataset.initialValue), true);
            window.addEventListener('resize', () => {
                const { value } = this.slider.dataset;
                this.setValue(Number(value) || 0);
            });
        }
        start(e) {
            this.down = true;
            this.diff = e.target === this.circle ? e.offsetX || this.radius : this.radius;
        }
        move(e) {
            e.preventDefault();
            if (!this.down)
                return;
            const value = this.getLeftPosition({
                event: e,
                diff: this.diff,
                sliderLeft: this.slider.offsetLeft,
                min: this.min,
                max: this.max(),
            }) / this.max();
            this.setValue(value);
            if (this.onChange) {
                this.onChange(value * (this.maxValue - this.minValue));
            }
        }
        stop(e) {
            if (e.target !== this.slider && e.target !== this.circle) {
                this.down = false;
                return;
            }
            if (!this.down) {
                this.diff = this.radius;
            }
            this.move(e);
            this.down = false;
            this.diff = 0;
        }
        max() {
            return this.sliderWidth() - (this.radius * 2);
        }
        sliderWidth() {
            return this.slider.offsetWidth;
        }
        getLeftPosition({ event, diff, sliderLeft, min, max, }) {
            const pageX = event.x || event.changedTouches[0].clientX;
            const relativeX = pageX - sliderLeft - diff;
            return Math.min(Math.max(relativeX, min), max);
        }
        getStyle({ value, sliderWidth, radius, max, }) {
            if (value > 1 || value < 0) {
                console.error('currentValue should correspond to the interval [0; 1]');
                return false;
            }
            const left = 100 * value * max / sliderWidth;
            const radiusP = 100 * radius / sliderWidth;
            const bgPosition = 100 - left - radiusP;
            return { left: `${left}%`, backgroundPosition: `${bgPosition}%` };
        }
        setValue(value, recalc) {
            const rvalue = recalc ? value / (this.maxValue - this.minValue) : value;
            const style = this.getStyle({
                value: rvalue,
                max: this.max(),
                radius: this.radius,
                sliderWidth: this.sliderWidth(),
            });
            if (!style || !this.circle)
                return;
            this.slider.dataset.value = `${rvalue}`;
            this.circle.style.left = style.left;
            this.slider.style.backgroundPosition = style.backgroundPosition;
        }
    }
    exports.default = Slider;
});
define("init-hls", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = (video, url) => {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                video.play();
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
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
        }
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
        }
    };
});
define("volume-analyser", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class VolumeAnalyser {
        constructor(element, fftSize) {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = audioCtx.createAnalyser();
            this.bar = document.querySelector('.chart__bar');
            const source = audioCtx.createMediaElementSource(element);
            source.connect(this.analyser);
            this.analyser.connect(audioCtx.destination);
            this.analyser.fftSize = fftSize;
            this.bufferLength = this.analyser.frequencyBinCount;
        }
        getData() {
            const dataArray = new Uint8Array(this.bufferLength);
            this.analyser.getByteFrequencyData(dataArray);
            return dataArray;
        }
        draw({ dataArray }) {
            const average = dataArray
                .reduce((prev, curr) => prev + curr, 0) / dataArray.length;
            this.bar.style.animationDelay = `-${average}ms`;
        }
    }
    exports.default = VolumeAnalyser;
});
define("player", ["require", "exports", "slider", "init-hls", "volume-analyser"], function (require, exports, slider_1, init_hls_1, volume_analyser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    slider_1 = __importDefault(slider_1);
    init_hls_1 = __importDefault(init_hls_1);
    volume_analyser_1 = __importDefault(volume_analyser_1);
    const videos = [...document.querySelectorAll('.video')];
    const wrappers = [...document.querySelectorAll('.video__wrapper')];
    const sliders = [...document.querySelectorAll('.slider')].map(s => new slider_1.default(s));
    const controls = document.querySelector('.video__controls');
    const goBack = controls && controls.querySelector('.button'); // ?
    const videoContainer = document.querySelector('.video__container');
    const fftSize = 256;
    const links = [
        'assets/streams/cat/master.m3u8',
        'assets/streams/dog/master.m3u8',
        'assets/streams/hall/master.m3u8',
        'assets/streams/sosed/master.m3u8',
    ];
    const filters = Array.from({ length: 4 }, () => ({
        brightness: 100,
        contrast: 100,
    }));
    const getOpenVideo = (getIndex) => (wrappers[getIndex ? 'findIndex' : 'find'](node => node.classList.contains('video--open')));
    const updateStyle = (index) => {
        const { brightness, contrast } = filters[index];
        videos[index].style.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
    };
    const updateInputValue = (index) => {
        sliders.forEach((slider) => {
            slider.setValue(filters[index][slider.name], true);
        });
    };
    const toggleView = (element, index = 0) => {
        const video = element.querySelector('video');
        element.classList.toggle('video--open');
        controls && controls.classList.toggle('video__controls--shown');
        if (video)
            video.muted = !video.muted;
        updateInputValue(index);
    };
    const play = (e) => {
        if (videos.every(v => !v.paused)) {
            return;
        }
        e.stopPropagation();
        videos.forEach(v => v.play());
    };
    links.forEach((link, index) => {
        init_hls_1.default(videos[index], link);
    });
    videoContainer && videoContainer.addEventListener('click', (e) => {
        const target = e.target.closest('.video__wrapper');
        if (!target || target.classList.contains('video--open')) {
            return;
        }
        if (!target.parentNode)
            return;
        const index = [...target.parentNode.children].findIndex(child => child === target);
        toggleView(target, index);
    });
    goBack && goBack.addEventListener('click', () => {
        const openedVideo = getOpenVideo();
        if (openedVideo)
            toggleView(openedVideo);
    });
    videos.forEach((video) => {
        video.addEventListener('loadeddata', () => {
            const volumeAnalyser = new volume_analyser_1.default(video, fftSize);
            const repaint = () => {
                requestAnimationFrame(repaint);
                if (!video.parentNode || !video.parentNode.classList.contains('video--open')) {
                    return;
                }
                volumeAnalyser.draw({
                    dataArray: volumeAnalyser.getData(),
                });
            };
            repaint();
        });
        video.addEventListener('click', play);
    });
    sliders.forEach((slider) => {
        slider.onChange = (value) => {
            const index = getOpenVideo(true);
            filters[index][slider.name] = value;
            updateStyle(index);
        };
    });
});
