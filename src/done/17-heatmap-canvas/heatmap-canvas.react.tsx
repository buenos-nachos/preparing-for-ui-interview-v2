import { forwardRef, useEffectEvent, useLayoutEffect, useImperativeHandle, useRef } from "react";
import css from "./heatmap-canvas.module.css";

export type HeatmapCanvasHandle = {
    update: (x: number, y: number, value: number) => void;
    clear: () => void;
}

type THeatmapCanvasProps = {
    size: number;
}

export const HeatmapCanvasComponent = forwardRef<HeatmapCanvasHandle, THeatmapCanvasProps>(({ size }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const pointsCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const gridSizeRef = useRef<number>(0);
    const pointsMapRef = useRef<Map<string, number>>(new Map());

    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, gridSize: number) => {
        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            ctx.moveTo(x + 0.5, 0); // +0.5 for crisp lines
            ctx.lineTo(x + 0.5, height);
        }

        // Horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(width, y + 0.5);
        }

        ctx.stroke();
    };

    const drawPoint = (ctx: CanvasRenderingContext2D, x: number, y: number, value: number, gridSize: number) => {
        const xPos = x * gridSize;
        const yPos = y * gridSize;

        ctx.clearRect(xPos, yPos, gridSize, gridSize);

        if (value > 0) {
            ctx.fillStyle = `rgba(255, 165, 0, ${value})`;
            ctx.fillRect(xPos, yPos, gridSize, gridSize);
        }
    };

    // Resize handling: Match canvas resolution to display size (DPI aware)
    const handleResize = useEffectEvent(() => {
        if (!containerRef.current || !gridCanvasRef.current || !pointsCanvasRef.current) return;

        const { width, height } = containerRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Update both canvases resolution
        const canvases = [gridCanvasRef.current, pointsCanvasRef.current];
        canvases.forEach(canvas => {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.scale(dpr, dpr);
        });

        const gridSize = width / size;
        gridSizeRef.current = gridSize;

        // Draw grid lines on the top layer
        const gridCtx = gridCanvasRef.current.getContext('2d');
        if (gridCtx) {
            drawGrid(gridCtx, width, height, gridSize);
        }

        // Repaint points on the bottom layer
        const pointsCtx = pointsCanvasRef.current.getContext('2d');
        if (pointsCtx) {
            // No need to clear, resizing canvas wipes it
            pointsMapRef.current.forEach((value, key) => {
                const [x, y] = key.split(',').map(Number);
                drawPoint(pointsCtx, x, y, value, gridSize);
            });
        }
    });

    useImperativeHandle(ref, () => ({
        update: (x: number, y: number, value: number) => {
            const canvas = pointsCanvasRef.current;
            const ctx = canvas?.getContext('2d');
            const gridSize = gridSizeRef.current;

            if (!canvas || !ctx || gridSize === 0) return;

            const clampedValue = Math.min(1, Math.max(0, value));
            const key = `${x},${y}`;

            // Update state
            if (clampedValue <= 0) {
                pointsMapRef.current.delete(key);
            } else {
                pointsMapRef.current.set(key, clampedValue);
            }

            // Draw
            drawPoint(ctx, x, y, clampedValue, gridSize);
        },
        clear: () => {
            const canvas = pointsCanvasRef.current;
            const ctx = canvas?.getContext('2d');

            // Clear state
            pointsMapRef.current.clear();

            if (canvas && ctx) {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }
        }
    }));

    useLayoutEffect(() => {
        const observer = new ResizeObserver(() => {
            handleResize();
        });

        handleResize();
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [handleResize]);

    return (
        <div ref={containerRef} className={css.container}>
            <canvas ref={pointsCanvasRef} className={css.pointsCanvas} />
            <canvas ref={gridCanvasRef} className={css.gridCanvas} />
        </div>
    );
});

HeatmapCanvasComponent.displayName = "HeatmapCanvasComponent";


