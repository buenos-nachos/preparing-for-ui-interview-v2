import { Component, type TComponentConfig } from "../abstract-component/component";
import styles from './star-rating.module.css'
import flex from '@course/styles'

type TStarRatingProps = {
    value: number;
    onValueChange: (value: number) => void;
    readOnly?: boolean;
}

const STAR = '⭐️';
const STARS_COUNT = 5;

export class StarRating extends Component<TStarRatingProps> {
    private value: number = 0;

    constructor(config: TComponentConfig<TStarRatingProps>) {
        super({
            ...config,
            className: [styles.container],
            listeners: ['click']
        });
        this.value = config.value;
    }

    onClick(event: MouseEvent): void {
        if (this.config.readOnly) return;

        const button = (event.target as HTMLElement).closest('button');
        if (!button) return;

        const starValue = Number(button.dataset.starValue);
        if (!Number.isNaN(starValue)) {
            this.value = starValue;
            this.config.onValueChange(starValue);
            this.render();
        }
    }

    toHTML(): string {
        const readonly = this.config.readOnly ?? false;

        const stars = Array.from({ length: STARS_COUNT }, (_, index) => {
            const starValue = index + 1;
            return `
                <button
                    aria-readonly="${readonly}"
                    data-star-value="${starValue}"
                    class="${styles.star} ${flex.flexColumnCenter}"
                    aria-label="${starValue} Star${starValue === 1 ? '' : 's'}"
                    aria-checked="${this.value === starValue}"
                    role="radio"
                    type="button"
                    data-active="${this.value >= starValue}"
                    ${readonly ? 'disabled' : ''}
                >
                    <span>${STAR}</span>
                </button>
            `;
        }).join('');

        return `
            <input type="number" value="${this.value}" readonly hidden />
            <div class="${flex.flexRowCenter}">
                ${stars}
            </div>
        `;
    }

    afterRender(): void {
        if (!this.container) return;

        this.container.setAttribute('role', 'radiogroup');
        this.container.setAttribute('aria-label', 'Star Rating');
        this.container.setAttribute('aria-readonly', String(this.config.readOnly ?? false));
    }
}