import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import css from "./heatmap.module.css";
import flex from "../../utilities/flex.module.css";

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

export const HeatmapExample = () => {
    const handleRef = useRef<HeatmapHandle>(null);
    const SIZE = 20;

    // Store values in a ref to simulate state without re-rendering component
    // In a real app, this data might live in a store or worker
    const valuesRef = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        let rafId: number;
        let timeoutId: ReturnType<typeof setTimeout>;

        const tick = () => {
            const x = Math.floor(Math.random() * SIZE);
            const y = Math.floor(Math.random() * SIZE);
            const key = `${x},${y}`;

            // Get current value from our "store"
            const currentVal = valuesRef.current.get(key) || 0;
            const newVal = Math.min(1, currentVal + 0.1);

            valuesRef.current.set(key, newVal);

            // Imperative update - O(1), no React render
            handleRef.current?.update(x, y, newVal);

            timeoutId = setTimeout(() => {
                rafId = requestAnimationFrame(tick);
            }, 10); // Faster updates to demonstrate performance
        };

        rafId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className={flex.p32}>
            <HeatmapComponent ref={handleRef} size={SIZE} />
            <div style={{ marginTop: 20 }}>
                <button onClick={() => {
                    handleRef.current?.clear();
                    valuesRef.current.clear();
                }}>
                    Reset
                </button>
            </div>
        </div>
    );
};
