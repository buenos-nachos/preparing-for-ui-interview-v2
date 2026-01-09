import { useRef, useEffect } from "react";
import { HeatmapComponent, type HeatmapHandle } from "./heatmap.react";
import flex from "@course/styles";

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
        <div className={flex.padding32}>
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
