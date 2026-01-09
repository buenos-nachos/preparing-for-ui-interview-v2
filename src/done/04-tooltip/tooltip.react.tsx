import React, { useEffect } from 'react';
import css from './tooltip.module.css';
import cx from '@course/cx';


type TooltipProps = {
    position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
    children: React.ReactNode;
    content: React.ReactNode;
};

const positions = {
    top: css.top,
    bottom: css.bottom,
    left: css.left,
    right: css.right,
} as const;

const OFFSET = 8; // 0.5rem

const getAutoPosition = (
    tooltipRect: DOMRect,
    triggerRect: DOMRect,
    windowWidth: number,
    windowHeight: number
): 'top' | 'bottom' | 'left' | 'right' => {
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;

    // 1. Try Top
    const topY = triggerRect.top - tooltipHeight - OFFSET;
    const topX = triggerRect.left + (triggerRect.width / 2) - (tooltipWidth / 2);
    if (topY >= 0 && topX >= 0 && topX + tooltipWidth <= windowWidth) {
        return 'top';
    }

    // 2. Try Right
    const rightX = triggerRect.right + OFFSET;
    const rightY = triggerRect.top + (triggerRect.height / 2) - (tooltipHeight / 2);
    if (rightX + tooltipWidth <= windowWidth && rightY >= 0 && rightY + tooltipHeight <= windowHeight) {
        return 'right';
    }

    // 3. Try Left
    const leftX = triggerRect.left - tooltipWidth - OFFSET;
    const leftY = triggerRect.top + (triggerRect.height / 2) - (tooltipHeight / 2);
    if (leftX >= 0 && leftY >= 0 && leftY + tooltipHeight <= windowHeight) {
        return 'left';
    }

    // 4. Try Bottom
    const bottomY = triggerRect.bottom + OFFSET;
    const bottomX = triggerRect.left + (triggerRect.width / 2) - (tooltipWidth / 2);
    if (bottomY + tooltipHeight <= windowHeight && bottomX >= 0 && bottomX + tooltipWidth <= windowWidth) {
        return 'bottom';
    }

    // Fallback
    return 'top';
};

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [tooltipPosition, setTooltipPosition] = React.useState<'top' | 'bottom' | 'left' | 'right'>(position === 'auto' ? 'top' : position);
    const tooltipRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && position === 'auto' && tooltipRef.current && containerRef.current) {
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const triggerRect = containerRef.current.getBoundingClientRect();

            const newPosition = getAutoPosition(
                tooltipRect,
                triggerRect,
                window.innerWidth,
                window.innerHeight
            );

            if (newPosition !== tooltipPosition) {
                setTooltipPosition(newPosition);
            }
        }
    }, [isVisible, position, tooltipPosition]);

    const tooltipId = React.useId();

    const show = () => setIsVisible(true);
    const hide = () => {
        setIsVisible(false);
        if (position === 'auto') setTooltipPosition('top');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            hide();
        }
    };

    return (
        <div
            ref={containerRef}
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
            onKeyDown={handleKeyDown}
            className={css.container}
            aria-describedby={isVisible ? tooltipId : undefined}
        >
            {children}
            {isVisible && (
                <div
                    id={tooltipId}
                    role="tooltip"
                    ref={tooltipRef}
                    className={cx(css.tooltip, positions[tooltipPosition])}
                >
                    {content}
                </div>
            )}
        </div>
    );
}



