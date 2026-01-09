import { Tooltip } from "./tooltip.react";
import { Tooltip as VanillaTooltip } from "./tooltip";
import { useEffect, useRef } from "react";
import flex from '@course/styles';
import cx from '@course/cx';


export function TooltipExample() {
    return (
        <div className={cx(flex.flexColumnCenter, flex.flexGap24, flex.paddingVer32, flex.paddingHor32)} style={{ minHeight: '200vh' }}>
            <div className={cx(flex.flexRowCenter, flex.flexGap32)}>
                <Tooltip position="top" content="Top tooltip">
                    <button>Top</button>
                </Tooltip>
                <Tooltip position="auto" content="Top tooltip">
                    <button>Auto</button>
                </Tooltip></div>

            <div className={cx(flex.flexRowCenter, flex.flexGap32)}>
                <Tooltip position="left" content="Left tooltip">
                    <button>Left</button>
                </Tooltip>
                <Tooltip position="right" content="Right tooltip">
                    <button>Right</button>
                </Tooltip>
            </div>
            <Tooltip position="bottom" content="Bottom tooltip">
                <button>Bottom</button>
            </Tooltip>
        </div>
    );
}

export function TooltipVanillaExample() {
    const topRef = useRef<HTMLDivElement>(null);
    const autoRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const createTooltip = (root: HTMLDivElement | null, text: string, position: 'top' | 'bottom' | 'left' | 'right' | 'auto', btnText: string) => {
            if (!root) return null;
            const btn = document.createElement('button');
            btn.textContent = btnText;
            const tooltip = new VanillaTooltip({
                root,
                children: btn,
                content: text,
                position
            });
            tooltip.render();
            return tooltip;
        };

        const tooltips = [
            createTooltip(topRef.current, "Top tooltip", "top", "Top"),
            createTooltip(autoRef.current, "Top tooltip", "auto", "Auto"),
            createTooltip(leftRef.current, "Left tooltip", "left", "Left"),
            createTooltip(rightRef.current, "Right tooltip", "right", "Right"),
            createTooltip(bottomRef.current, "Bottom tooltip", "bottom", "Bottom"),
        ];

        return () => {
            tooltips.forEach(t => t?.destroy());
        };
    }, []);

    return (
        <div className={cx(flex.flexColumnCenter, flex.flexGap24, flex.paddingVer32, flex.paddingHor32)} style={{ minHeight: '200vh' }}>
            <div className={cx(flex.flexRowCenter, flex.flexGap32)}>
                <div ref={topRef}></div>
                <div ref={autoRef}></div>
            </div>

            <div className={cx(flex.flexRowCenter, flex.flexGap32)}>
                <div ref={leftRef}></div>
                <div ref={rightRef}></div>
            </div>
            <div ref={bottomRef}></div>
        </div>
    );
}
