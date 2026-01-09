import { Component, type TComponentConfig } from "../abstract-component/component";
import css from './tooltip.module.css';


type TTooltipProps = {
    position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
    children: HTMLElement
    content: string
};

const positions = {
    top: css.top,
    bottom: css.bottom,
    left: css.left,
    right: css.right,
} as const;

let id = 0;

function getAutoPosition(tooltip: HTMLElement, container: HTMLElement) {
    const [tooltipRect, containerRect] = [tooltip.getBoundingClientRect(), container.getBoundingClientRect()];
    const [viewportWidth, viewportHeight] = [window.innerWidth, window.innerHeight];

    const topY = containerRect.top - tooltipRect.height;
    const topX = containerRect.left + (containerRect.width / 2) - tooltipRect.width / 2;

    if (topX >= 0 && topY >= 0 && topX + tooltipRect.width <= viewportWidth) {
        return 'top';
    }

    const rightX = containerRect.right + tooltipRect.width;
    const rightY = containerRect.top + (containerRect.height / 2) - tooltipRect.height / 2;

    if (rightX <= viewportWidth && rightY >= 0 && rightY + tooltipRect.height <= viewportHeight) {
        return 'right';
    }

    const leftX = containerRect.left - tooltipRect.width;
    const leftY = containerRect.top + (containerRect.height / 2) - tooltipRect.height / 2;

    if (leftX >= 0 && leftY >= 0 && leftY + tooltipRect.height <= viewportHeight) {
        return 'left';
    }

    const bottomY = containerRect.bottom + tooltipRect.height;
    const bottomX = containerRect.left + (containerRect.width / 2) - tooltipRect.width / 2;

    if (bottomY <= viewportHeight && bottomX >= 0 && bottomX + tooltipRect.width <= viewportWidth) {
        return 'bottom';
    }

    return 'top';

}


export class Tooltip extends Component<TTooltipProps> {

    id = id++;
    tooltipElement: HTMLElement | null = null;

    constructor(config: TComponentConfig<TTooltipProps>) {
        super({
            ...config,
            className: [css.container],
            listeners: ['mouseenter', 'mouseleave', 'focusin', 'focusout', 'keydown']
        });
    }

    toHTML(): string {
        const position = this.config.position ?? 'top';
        return `<div id="tooltip-${this.id}" style="display: none;" role="tooltip" class="${css.tooltip} ${positions[position as keyof typeof positions]}">${this.config.content}</div>`
    }

    afterRender(): void {
        this.container!.appendChild(this.config.children)
        this.tooltipElement = this.container!.querySelector(`#tooltip-${this.id}`)
    }

    onMouseenter() {
        this.showTooltip();
    }

    onMouseleave() {
        this.tooltipElement!.style.display = 'none'
    }

    onFocusin() {
        this.showTooltip();
    }

    onFocusout() {
        this.tooltipElement!.style.display = 'none'
    }

    onKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            this.tooltipElement!.style.display = 'none'
        }
    }


    showTooltip() {
        this.tooltipElement!.style.display = 'block'
        if (this.config.position === 'auto') {
            const position = positions[getAutoPosition(this.tooltipElement!, this.container!)]
            for (const classname of Object.values(positions)) {
                this.tooltipElement!.classList.remove(classname)
            }
            this.tooltipElement!.classList.add(position)
        }
    }
}