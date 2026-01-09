import { useRef, useEffect } from "react";
import { HeatmapCanvasComponent, type HeatmapCanvasHandle } from "./heatmap-canvas.react";
import flex from "@course/styles";

export const HeatmapCanvasExample = () => {
    const handleRef = useRef<HeatmapCanvasHandle>(null);
    const SIZE = 10; // Matches previous example size
    const valuesRef = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        let rafId: number;
        let timeoutId: ReturnType<typeof setTimeout>;

        const tick = () => {
            const x = Math.floor(Math.random() * SIZE);
            const y = Math.floor(Math.random() * SIZE);
            const key = `${x},${y}`;

            const currentVal = valuesRef.current.get(key) || 0;
            const newVal = Math.min(1, currentVal + 0.1);
            valuesRef.current.set(key, newVal);

            handleRef.current?.update(x, y, newVal);

            timeoutId = setTimeout(() => {
                rafId = requestAnimationFrame(tick);
            }, 10);
        };

        rafId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className={flex.padding32}>
            <h2>Canvas Heatmap</h2>
            <HeatmapCanvasComponent ref={handleRef} size={SIZE} />
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
