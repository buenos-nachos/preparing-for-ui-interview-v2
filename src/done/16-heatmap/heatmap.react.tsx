import { forwardRef, useImperativeHandle, useRef } from "react";
import css from "./heatmap.module.css";

export type HeatmapHandle = {
    update: (x: number, y: number, value: number) => void;
    clear: () => void;
}

type THeatmapProps = {
    size: number;
}

export const HeatmapComponent = forwardRef<HeatmapHandle, THeatmapProps>(({ size }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cellsMapRef = useRef<Map<string, HTMLDivElement>>(new Map());

    useImperativeHandle(ref, () => ({
        update: (x: number, y: number, value: number) => {
            if (!containerRef.current) return;

            const key = `${x},${y}`;
            const map = cellsMapRef.current;
            const clampedValue = Math.min(1, Math.max(0, value));

            // If value is 0 or less, remove the cell
            if (clampedValue <= 0) {
                const element = map.get(key);
                if (element) {
                    element.remove();
                    map.delete(key);
                }
                return;
            }

            // Update or Create
            let element = map.get(key);
            if (!element) {
                element = document.createElement('div');
                element.className = css.cell;
                element.style.gridColumn = `${x + 1}`;
                element.style.gridRow = `${y + 1}`;

                containerRef.current.appendChild(element);
                map.set(key, element);
            }

            // Efficiently update opacity
            element.style.opacity = clampedValue.toString();
        },
        clear: () => {
            const map = cellsMapRef.current;
            map.forEach(element => element.remove());
            map.clear();
        }
    }));

    return (
        <div
            ref={containerRef}
            className={css.container}
            style={{
                '--size': size,
            } as React.CSSProperties}
        />
    );
});

HeatmapComponent.displayName = "HeatmapComponent";


