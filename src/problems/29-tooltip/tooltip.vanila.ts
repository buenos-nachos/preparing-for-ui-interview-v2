import {AbstractComponent, type TComponentConfig} from '@course/utils'
import css from './tooltip.module.css'
import cx from '@course/cx'

type TPositionType = 'top' | 'bottom' | 'left' | 'right' | 'auto'

type TCandidate = { position: 'top' | 'bottom' | 'left' | 'right'; x: number; y: number }

type TTooltipProps = {
    position?: TPositionType
    children: HTMLElement
    content: string
    boundary?: HTMLElement
}

const positions: Record<TPositionType, string> = {
    top: css.top,
    bottom: css.bottom,
    left: css.left,
    right: css.right,
    auto: ''
} as const

let id = 0

/**
 * Helper: determine best position when position='auto'
 * - Get bounding rects for tooltip and container
 * - Check candidates (top, right, bottom, left) against boundary
 * - Return first position that fits, or 'top' as fallback
 */
function getAutoPosition(
    tooltip: HTMLElement,
    container: HTMLElement,
    boundaryElement: HTMLElement,
): Exclude<TPositionType, 'auto'> {
    /**
     *                  ┌───TOP───┐
     *                  └─────────┘
     *     ┌──LEFT──┐   ┌─────────┐   ┌──RIGHT──┐
     *     └────────┘   │CONTAINER│   └─────────┘
     *                  └─────────┘
     *                  ┌──BOTTOM─┐
     *                  └─────────┘
     */
    const candidates: TCandidate[] = [
        {position: 'top', x: 0, y: 0},
        {position: 'right', x: 0, y: 0},
        {position: 'bottom', x: 0, y: 0},
        {position: 'left', x: 0, y: 0},
    ];

    /**
     * boundaryRect.left          boundaryRect.right
     *        ↓                          ↓
     *        ┌──────────────────────────┐  ← boundaryRect.top
     *        │                          │
     *        │                          │
     *        │      ┌──────────┐        │
     *        │      │  TOOLTIP │        │
     *        │      └──────────┘        │
     *        │                          │
     *        │                          │
     *        └──────────────────────────┘  ← boundaryRect.bottom
     */
    const fit = ({x, y}: TCandidate) => {
    }
    return 'top';
}

/**
 * Expected input:
 * {
 *   "children": HTMLElement (the trigger element),
 *   "content": "Tooltip text",
 *   "position": "top" | "bottom" | "left" | "right" | "auto",
 *   "boundary": HTMLElement (optional, for auto-positioning)
 * }
 *
 * Step 1: Extend AbstractComponent<TTooltipProps>
 * - Call super() with config, adding:
 *   - className: [css.container]
 *   - listeners: ['mouseenter', 'mouseleave', 'focusin', 'focusout', 'keydown']
 * - Store a unique id and a reference for the tooltip element
 */
export class Tooltip extends AbstractComponent<TTooltipProps> {

    id = `${id++}`;
    tooltip: HTMLElement | null = null;

    constructor(config: TComponentConfig<TTooltipProps>) {
        super({
            ...config,
            className: [css.container],
            listeners: ['mouseenter', 'mouseleave', 'focusin', 'focusout', 'keydown'],
        })
    }

    /**
     * Step 2: Implement toHTML
     * - Return a <div> with role="tooltip", unique id, display:none
     * - Apply css.tooltip class and position class from positions map
     * - Content comes from this.config.content
     * a11y: role="tooltip" on the tooltip element
     */
    toHTML(): string {
        return ``;
    }

    /**
     * Step 3: Implement afterRender
     * - Append this.config.children (the trigger element) to this.container
     * - Query and store the tooltip element by its id
     * a11y: set aria-describedby on the trigger element pointing to the tooltip id
     */
    afterRender(): void {
    }

    /**
     * Step 4: Implement event handlers
     * - onMouseenter / onFocusin: show the tooltip (call showTooltip)
     * - onMouseleave / onFocusout: hide the tooltip (set display to 'none')
     * - onKeydown: hide on Escape key
     * a11y: focusin/focusout ensure keyboard users can trigger tooltip; Escape dismisses it
     */
    onMouseenter() {
    }

    onMouseleave() {
    }

    onFocusin() {
    }

    onFocusout() {
    }

    onKeydown(e: KeyboardEvent) {
    }

    /**
     * Step 5: Implement showTooltip
     * - Set tooltip display to 'block'
     * - If position is 'auto': compute best position using getAutoPosition,
     *   remove all position classes, add the computed one
     */
    showTooltip() {
    }

    hideTooltip() {
    }
}
