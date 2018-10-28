var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("create-card", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const cardTemplate = document.getElementById('card');
    const bodyTemplate = document.getElementById('body');
    const graphTemplate = document.getElementById('graph');
    const imageTemplate = document.getElementById('image');
    const playerTemplate = document.getElementById('player');
    const buttonsTemplate = document.getElementById('buttons');
    const indicatorTemplate = document.getElementById('indicator');
    const cardContent = cardTemplate.content;
    const bodyContent = bodyTemplate.content;
    const graphContent = graphTemplate.content;
    const imageContent = imageTemplate.content;
    const playerContent = playerTemplate.content;
    const buttonsContent = buttonsTemplate.content;
    const indicatorContent = indicatorTemplate.content;
    const createButtons = ([first, second]) => {
        const clone = buttonsContent.cloneNode(true);
        const node = clone.querySelector('.button__group');
        if (!node)
            return null;
        if (node.children[0])
            node.children[0].innerHTML = first;
        if (node.children[1])
            node.children[1].innerHTML = second;
        return node;
    };
    const createGraph = () => {
        const clone = graphContent.cloneNode(true);
        const node = clone.querySelector('img');
        if (!node)
            return null;
        node.src = 'assets/Richdata.svg';
        return node;
    };
    const createImages = () => {
        const clone = imageContent.cloneNode(true);
        const node = clone;
        node.querySelectorAll('img').forEach((img) => {
            img.srcset = 'assets/bitmap.jpg 820w, assets/bitmap2.jpg 1664w, assets/bitmap3.jpg 2496w';
            img.sizes = '(max-width: 900px) 90vw, 30vw';
            img.src = 'assets/bitmap3.jpg';
        });
        return node;
    };
    const createIndicator = ({ temperature, humidity }) => {
        const clone = indicatorContent.cloneNode(true);
        const node = clone.querySelector('.indicator__group');
        if (!node)
            return null;
        const values = node.querySelectorAll('.indicator__value');
        values[0].innerHTML = `${temperature} C`;
        values[1].innerHTML = `${humidity}%`;
        return node;
    };
    const createPlayer = (data) => {
        const node = playerContent.querySelector('.player');
        if (!node)
            return;
        const input = node.querySelector('.range--round');
        const image = node.querySelector('.player__albumcover');
        input.value = data.volume;
        image.src = data.albumcover;
        const playerArtist = node.querySelector('.player__artist');
        const playerVolume = node.querySelector('.player__volume');
        const playerDuration = node.querySelector('.player__duration');
        if (playerArtist)
            playerArtist.innerHTML = data.artist;
        if (playerVolume)
            playerVolume.innerHTML = data.volume;
        if (playerDuration)
            playerDuration.innerHTML = data.track.length;
        return node;
    };
    exports.default = (event) => {
        const { size, description, data, icon, title, source, time, } = event;
        const cardClone = cardContent.cloneNode(true);
        const card = cardClone.querySelector('.card');
        if (!card)
            return;
        card.classList.add(`card--${size}`, `card--${event.type}`);
        if (!description && !data) {
            card.classList.add('card--small');
        }
        const cardImage = card.querySelector('img');
        const cardTitle = card.querySelector('span');
        const cardSubtitle = card.querySelector('.card__subtitle');
        if (cardImage)
            cardImage.src = `assets/${icon}.svg`;
        if (cardTitle) {
            cardTitle.title = title;
            cardTitle.innerHTML = title;
        }
        if (cardSubtitle && cardSubtitle.children.length > 1) {
            cardSubtitle.children[0].innerHTML = source;
            cardSubtitle.children[1].innerHTML = time;
        }
        if (!description && !data) {
            return card;
        }
        const bodyClone = bodyContent.cloneNode(true);
        const cardBody = bodyClone.querySelector('.card__body');
        if (!cardBody)
            return;
        const cardDescription = cardBody.querySelector('.card__description');
        if (cardDescription)
            cardDescription.innerHTML = description;
        card.appendChild(cardBody);
        const { buttons, type, image, albumcover, } = event.data || {};
        if (buttons) {
            cardBody.appendChild(createButtons(buttons));
        }
        else if (type === 'graph') {
            cardBody.appendChild(createGraph());
        }
        else if (image) {
            cardBody.appendChild(createImages());
        }
        else if (event.data && ['temperature', 'humidity'].every(k => event.data.hasOwnProperty(k))) {
            cardBody.appendChild(createIndicator(event.data));
        }
        else if (albumcover) {
            cardBody.appendChild(createPlayer(event.data));
        }
        return card;
    };
});
define("add-touch-listener", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ({ targetNode, imageNode, sliderX, brightnessInfo, }) => {
        const touches = {};
        const minBrightness = 0.3;
        const maxBrightness = 1;
        const brightnessStep = 0.05;
        const scrollSpeed = 25;
        let currentLeft = 0;
        let brightness = 1;
        let prevYDiff = 0;
        const getSliderPosition = () => {
            const maxSliderPosition = targetNode.offsetWidth - sliderX.offsetWidth;
            const maxLeftPosition = imageNode.offsetWidth - targetNode.offsetWidth;
            const percentage = currentLeft * -1 / maxLeftPosition;
            return maxSliderPosition * percentage;
        };
        const setLeft = (value) => {
            currentLeft = value;
            imageNode.style.left = `${currentLeft}px`;
            sliderX.style.left = `${getSliderPosition()}px`;
        };
        const setBrightness = (value) => {
            brightness = value;
            imageNode.style.filter = `brightness(${brightness})`;
            brightnessInfo.innerHTML = `${Math.round(brightness * 100)}%`;
        };
        const changeBrightness = () => {
            const clientYs = Object.values(touches).map(({ clientY }) => clientY);
            const currDiff = Math.abs(clientYs[0] - clientYs[1]);
            let newValue;
            if (!prevYDiff) {
                newValue = brightness;
            }
            else if (currDiff > prevYDiff) {
                newValue = Math.min(brightness + brightnessStep, maxBrightness);
            }
            else {
                newValue = Math.max(brightness - brightnessStep, minBrightness);
            }
            setBrightness(newValue);
            prevYDiff = currDiff;
        };
        const changeLeftPosition = (e) => {
            const touch = touches[e.pointerId];
            setLeft(currentLeft + e.pageX - touch.pageX);
            touches[e.pointerId] = e;
        };
        const scrollForward = () => {
            if (currentLeft < 0)
                return;
            const value = currentLeft - scrollSpeed;
            setLeft(value > 0 ? value : currentLeft - 1);
            requestAnimationFrame(scrollForward);
        };
        const scrollBack = () => {
            const maxLeft = -1 * (imageNode.offsetWidth - targetNode.offsetWidth);
            if (currentLeft > maxLeft)
                return;
            const value = currentLeft + scrollSpeed;
            setLeft(value < maxLeft ? value : currentLeft + 1);
            requestAnimationFrame(scrollBack);
        };
        const onpointerdown = (e) => {
            touches[e.pointerId] = e;
            targetNode.setPointerCapture(e.pointerId);
        };
        const onpointermove = (e) => {
            const amount = Object.keys(touches).length;
            if (amount === 1) {
                changeLeftPosition(e);
            }
            else if (amount === 2) {
                touches[e.pointerId] = e;
                changeBrightness();
            }
        };
        const onpointerup = () => {
            if (currentLeft > 0) {
                scrollForward();
            }
            else if (Math.abs(currentLeft) > imageNode.offsetWidth - targetNode.offsetWidth) {
                scrollBack();
            }
            Object.keys(touches).forEach((key) => {
                delete touches[key];
            });
        };
        if (!targetNode || !imageNode || !sliderX || !brightnessInfo)
            return;
        targetNode.addEventListener('pointerup', onpointerup);
        targetNode.addEventListener('pointercancel', onpointerup);
        targetNode.addEventListener('pointerdown', onpointerdown);
        targetNode.addEventListener('pointermove', onpointermove);
    };
});
define("show-touch-nodes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const isTouchDevice = () => (!!navigator.maxTouchPoints && 'ontouchstart' in window);
    exports.default = (root) => {
        const showOnDesktop = document.querySelectorAll('.show-on-desktop');
        const showOnMobile = document.querySelectorAll('.show-on-touch');
        const isMobile = isTouchDevice();
        root.classList[isMobile ? 'add' : 'remove']('no-hover');
        showOnDesktop.forEach((node) => {
            node.classList[isMobile ? 'add' : 'remove']('hidden');
        });
        showOnMobile.forEach((node) => {
            node.classList[isMobile ? 'remove' : 'add']('hidden');
        });
    };
});
define("index", ["require", "exports", "create-card", "add-touch-listener", "show-touch-nodes"], function (require, exports, create_card_1, add_touch_listener_1, show_touch_nodes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    create_card_1 = __importDefault(create_card_1);
    add_touch_listener_1 = __importDefault(add_touch_listener_1);
    show_touch_nodes_1 = __importDefault(show_touch_nodes_1);
    const root = document.querySelector('.page');
    const main = document.querySelector('.page__main');
    fetch('https://agile-plains-47360.herokuapp.com/api/events')
        // fetch('http://localhost:8000/api/events')
        .then(r => r.json())
        .then(({ array }) => {
        array.forEach((item) => {
            const node = create_card_1.default(item);
            main.appendChild(node);
        });
        show_touch_nodes_1.default(root);
        add_touch_listener_1.default({
            imageNode: document.querySelector('.image-m'),
            sliderX: document.querySelector('.image-m__track'),
            brightnessInfo: document.querySelector('.brightness'),
            targetNode: document.querySelector('.image-m__container'),
        });
    })
        .catch(console.log);
});
