import { Component, type TComponentConfig } from "../abstract-component/component";
import styles from './gallery.module.css';
import flex from '@course/styles';
import cx from '@course/cx';

export type TGalleryProps = {
    images: string[];
};

export class Gallery extends Component<TGalleryProps> {
    private list: HTMLUListElement | null = null;
    private prevBtn: HTMLButtonElement | null = null;
    private nextBtn: HTMLButtonElement | null = null;
    private dots: HTMLButtonElement[] = [];
    private currentIndex: number = 0;

    constructor(config: TComponentConfig<TGalleryProps>) {
        super({
            ...config,
            className: [styles.container, ...(config.className || [])],
            listeners: ['click', ...(config.listeners || [])]
        });
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    init() {
        super.init();
        window.addEventListener('keydown', this.handleKeyDown);
    }

    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        super.destroy();
    }

    handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'ArrowLeft') this.handlePrev();
        if (e.key === 'ArrowRight') this.handleNext();
    }

    onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;

        if (target.closest(`.${styles.buttonPrev}`)) {
            this.handlePrev();
        } else if (target.closest(`.${styles.buttonNext}`)) {
            this.handleNext();
        } else {
            const dot = target.closest(`.${styles.dot}`);
            if (dot) {
                const index = Array.from(dot.parentElement!.children).indexOf(dot);
                this.goToSlide(index);
            }
        }
    }

    handlePrev() {
        this.goToSlide(Math.max(0, this.currentIndex - 1));
    }

    handleNext() {
        this.goToSlide(Math.min(this.config.images.length - 1, this.currentIndex + 1));
    }

    goToSlide(index: number) {
        if (index === this.currentIndex) return;
        this.currentIndex = index;
        this.updateView();
    }

    updateView() {
        if (!this.list || !this.prevBtn || !this.nextBtn) return;

        // Update list transform
        this.list.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        // Update buttons state
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.config.images.length - 1;

        // Update indicators
        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add(styles.dotActive);
            } else {
                dot.classList.remove(styles.dotActive);
            }
        });

        // Update images lazy loading simulation (from React code: src={currentIndex + 2 >= index ? image : undefined})
        // In vanilla, we can just update all or check. 
        // Let's replicate the React logic: 
        const items = this.list.querySelectorAll(`.${styles.item} img`);
        items.forEach((img, index) => {
            if (this.currentIndex + 2 >= index) {
                const src = this.config.images[index];
                if (img.getAttribute('src') !== src) {
                    img.setAttribute('src', src);
                }
            }
        });
    }

    afterRender() {
        super.afterRender();
        this.list = this.container!.querySelector(`.${styles.list}`);
        this.prevBtn = this.container!.querySelector(`.${styles.buttonPrev}`);
        this.nextBtn = this.container!.querySelector(`.${styles.buttonNext}`);
        this.dots = Array.from(this.container!.querySelectorAll(`.${styles.dot}`));
    }

    toHTML(): string {
        const { images } = this.config;

        if (images.length === 0) {
            return `<div class="${styles.empty}">No images to display</div>`;
        }

        return `
            <button
                ${this.currentIndex === 0 ? 'disabled' : ''}
                class="${cx(styles.button, styles.buttonPrev)}"
                aria-label="Previous image"
            >
                &lt;
            </button>

            <ul
                class="${cx(flex.flexRowStart, styles.list)}"
                style="transform: translateX(-${this.currentIndex * 100}%)"
            >
                ${images.map((image, index) => `
                    <li class="${styles.item}">
                        <img
                            src="${this.currentIndex + 2 >= index ? image : ''}"
                            alt="Gallery image ${index + 1}"
                        />
                    </li>
                `).join('')}
            </ul>

            <button
                ${this.currentIndex === images.length - 1 ? 'disabled' : ''}
                class="${cx(styles.button, styles.buttonNext)}"
                aria-label="Next image"
            >
                &gt;
            </button>

            <div class="${styles.indicators}">
                ${images.map((_, index) => `
                    <button
                        class="${cx(styles.dot, this.currentIndex === index ? styles.dotActive : '')}"
                        aria-label="Go to image ${index + 1}"
                    ></button>
                `).join('')}
            </div>
        `;
    }
}
