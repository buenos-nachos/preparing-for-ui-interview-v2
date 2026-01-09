import React, { useMemo, useRef, useState } from "react";
import css from "./infinite-canvas.module.css";

const MINIMAP_SIZE = 200;
const WORLD_EXTENT = 5000;
const GRID_CELL_SIZE = 100;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 8;
const ZOOM_SENSITIVITY = 0.001;

// Shape dimension constants
const CIRCLE_SIZE = 100;
const RECT_WIDTH = 120;
const RECT_HEIGHT = 80;

type TCameraState = {
    zoom: number;
    panX: number;
    panY: number;
};

type TShape = {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    type: "circle" | "rectangle" | "text";
    text?: string;
    order: number;
};

type TWorldState = {
    shapes: Record<string, TShape>;
};

function screenToWorld(
    clientX: number,
    clientY: number,
    camera: TCameraState,
    viewportRect: DOMRectReadOnly
) {
    const worldX = (clientX - viewportRect.left - camera.panX) / camera.zoom;
    const worldY = (clientY - viewportRect.top - camera.panY) / camera.zoom;
    return { worldX, worldY };
}

const scale = (state: TCameraState) => ({
    transform: `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`,
});

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

const mod = (n: number, m: number) => ((n % m) + m) % m;

export const InfiniteCanvas = () => {
    const [camera, setCamera] = useState<TCameraState>(() => {
        const hasWindow = typeof window !== "undefined";
        return {
            zoom: 1,
            panX: hasWindow ? window.innerWidth / 2 : 0,
            panY: hasWindow ? window.innerHeight / 2 : 0,
        };
    });

    const [worldState, setWorldState] = useState<TWorldState>(() => ({
        shapes: {
            "1": {
                id: "1",
                x: 0,
                y: 0,
                width: 120,
                height: 80,
                type: "rectangle",
                order: 0,
            },
            "2": {
                id: "2",
                x: 200,
                y: 160,
                width: 100,
                height: 100,
                type: "circle",
                order: 1,
            },
        },
    }));

    const containerRef = useRef<HTMLElement | null>(null);

    // Pan tracking (screen space)
    const lastX = useRef(0);
    const lastY = useRef(0);

    // Drag session (shape drag uses world space)
    const isDragging = useRef(false);
    const dragMode = useRef<"pan" | "drag" | null>(null);
    const dragShapeId = useRef<string | null>(null);
    const dragStartPointerWorld = useRef<{ x: number; y: number } | null>(null);
    const dragStartShapeWorld = useRef<{ x: number; y: number } | null>(null);

    // Toolbar drag-to-create state
    const [toolbarDrag, setToolbarDrag] = useState<{
        type: "circle" | "rectangle";
        x: number;
        y: number;
    } | null>(null);

    const addShapeAtPosition = (type: "circle" | "rectangle", clientX: number, clientY: number) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const { worldX, worldY } = screenToWorld(clientX, clientY, camera, rect);

        const width = type === "circle" ? CIRCLE_SIZE : RECT_WIDTH;
        const height = type === "circle" ? CIRCLE_SIZE : RECT_HEIGHT;
        const id = Date.now().toString();

        setWorldState((prev) => {
            const maxOrder = Math.max(0, ...Object.values(prev.shapes).map((s) => s.order));
            return {
                ...prev,
                shapes: {
                    ...prev.shapes,
                    [id]: {
                        id,
                        x: worldX - width / 2,
                        y: worldY - height / 2,
                        width,
                        height,
                        type,
                        order: maxOrder + 1,
                    },
                },
            };
        });
    };

    const onToolbarPointerDown = (e: React.PointerEvent, type: "circle" | "rectangle") => {
        e.preventDefault();
        e.stopPropagation();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        setToolbarDrag({ type, x: e.clientX, y: e.clientY });
    };

    const onToolbarPointerMove = (e: React.PointerEvent) => {
        if (!toolbarDrag) return;
        setToolbarDrag({ ...toolbarDrag, x: e.clientX, y: e.clientY });
    };

    const onToolbarPointerUp = (e: React.PointerEvent) => {
        if (!toolbarDrag) return;
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);

        // Check if dropped on canvas (not on toolbar)
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect && e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            addShapeAtPosition(toolbarDrag.type, e.clientX, e.clientY);
        }

        setToolbarDrag(null);
    };

    const onPointerDown = (e: React.PointerEvent) => {
        e.preventDefault();

        lastX.current = e.clientX;
        lastY.current = e.clientY;

        isDragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);

        // Reset any previous drag session
        dragMode.current = "pan";
        dragShapeId.current = null;
        dragStartPointerWorld.current = null;
        dragStartShapeWorld.current = null;

        // Detect shape via closest() so it works even with nested children
        const targetEl = e.target as HTMLElement | null;
        const shapeEl = targetEl?.closest?.("[data-shape-id]") as HTMLElement | null;
        const shapeId = shapeEl?.getAttribute("data-shape-id");
        if (!shapeId) return;

        const shape = worldState.shapes[shapeId];
        if (!shape) return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const { worldX, worldY } = screenToWorld(e.clientX, e.clientY, camera, rect);

        dragMode.current = "drag";
        dragShapeId.current = shapeId;
        dragStartPointerWorld.current = { x: worldX, y: worldY };
        dragStartShapeWorld.current = { x: shape.x, y: shape.y };
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;

        // Shape drag (WORLD space)
        if (dragMode.current === "drag" && dragShapeId.current) {
            const rect = containerRef.current?.getBoundingClientRect();
            const startPointer = dragStartPointerWorld.current;
            const startShape = dragStartShapeWorld.current;

            if (!rect || !startPointer || !startShape) return;

            const { worldX, worldY } = screenToWorld(e.clientX, e.clientY, camera, rect);
            const dx = worldX - startPointer.x;
            const dy = worldY - startPointer.y;

            const shapeId = dragShapeId.current;

            setWorldState((prev) => {
                const shape = prev.shapes[shapeId];
                if (!shape) return prev;

                return {
                    ...prev,
                    shapes: {
                        ...prev.shapes,
                        [shapeId]: {
                            ...shape,
                            x: startShape.x + dx,
                            y: startShape.y + dy,
                        },
                    },
                };
            });

            return;
        }

        // Pan (SCREEN space)
        const dx = e.clientX - lastX.current;
        const dy = e.clientY - lastY.current;

        setCamera((c) => ({
            ...c,
            panX: c.panX + dx,
            panY: c.panY + dy,
        }));

        lastX.current = e.clientX;
        lastY.current = e.clientY;
    };

    const onPointerUp = (e: React.PointerEvent) => {
        isDragging.current = false;

        // Clear session so we don't "ghost drag" later
        dragMode.current = null;
        dragShapeId.current = null;
        dragStartPointerWorld.current = null;
        dragStartShapeWorld.current = null;

        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    const onWheel = (e: React.WheelEvent) => {
        e.preventDefault();

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        // World point under cursor (use container offset!)
        const { worldX, worldY } = screenToWorld(e.clientX, e.clientY, camera, rect);

        const zoomFactor = Math.exp(-e.deltaY * ZOOM_SENSITIVITY);
        const zoom = clamp(camera.zoom * zoomFactor, MIN_ZOOM, MAX_ZOOM);

        // Keep cursor anchored
        setCamera({
            zoom,
            panX: (e.clientX - rect.left) - worldX * zoom,
            panY: (e.clientY - rect.top) - worldY * zoom,
        });
    };

    // Minimap viewport rect (memoized for performance)
    const viewportW = (containerRef.current as HTMLElement | null)?.clientWidth ?? 0;
    const viewportH = (containerRef.current as HTMLElement | null)?.clientHeight ?? 0;

    const { miniX, miniY, miniW, miniH } = useMemo(() => {
        const worldLeft = -camera.panX / camera.zoom;
        const worldTop = -camera.panY / camera.zoom;
        const worldRight = (viewportW - camera.panX) / camera.zoom;
        const worldBottom = (viewportH - camera.panY) / camera.zoom;

        const minimapScale = MINIMAP_SIZE / (WORLD_EXTENT * 2);

        let x = (worldLeft + WORLD_EXTENT) * minimapScale;
        let y = (worldTop + WORLD_EXTENT) * minimapScale;
        let w = (worldRight - worldLeft) * minimapScale;
        let h = (worldBottom - worldTop) * minimapScale;

        x = clamp(x, 0, MINIMAP_SIZE);
        y = clamp(y, 0, MINIMAP_SIZE);
        w = clamp(w, 0, MINIMAP_SIZE - x);
        h = clamp(h, 0, MINIMAP_SIZE - y);

        return { miniX: x, miniY: y, miniW: w, miniH: h };
    }, [camera.panX, camera.panY, camera.zoom, viewportW, viewportH]);

    const gridSize = Math.max(1, GRID_CELL_SIZE * camera.zoom);

    return (
        <section
            ref={(el) => {
                containerRef.current = el;
            }}
            className={css.container}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
            style={
                {
                    "--grid-size": `${gridSize}px`,
                    "--grid-offset-x": `${mod(camera.panX, gridSize)}px`,
                    "--grid-offset-y": `${mod(camera.panY, gridSize)}px`,
                } as React.CSSProperties
            }
        >
            <div className={css.world} style={scale(camera)}>
                {Object.values(worldState.shapes)
                    .sort((a, b) => a.order - b.order)
                    .map((shape) => {
                        const isCircle = shape.type === "circle";
                        return (
                            <div
                                key={shape.id}
                                data-shape-id={shape.id}
                                style={{
                                    position: "absolute",
                                    left: shape.x,
                                    top: shape.y,
                                    width: shape.width,
                                    height: shape.height,
                                    background: isCircle ? "rgba(255,0,0,0.25)" : "rgba(255,0,0,0.2)",
                                    border: "1px solid rgba(255,0,0,0.6)",
                                    borderRadius: isCircle ? "999px" : "6px",
                                    boxSizing: "border-box",
                                    userSelect: "none",
                                    touchAction: "none",
                                }}
                            >
                                {shape.type === "text" ? shape.text : null}
                            </div>
                        );
                    })}

                {/* World origin marker */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 8,
                        height: 8,
                        background: "red",
                    }}
                />
            </div>

            {/* Toolbar */}
            <div className={css.toolbar}>
                <button
                    className={css.toolbarButton}
                    onPointerDown={(e) => onToolbarPointerDown(e, "rectangle")}
                    onPointerMove={onToolbarPointerMove}
                    onPointerUp={onToolbarPointerUp}
                    onPointerCancel={() => setToolbarDrag(null)}
                    title="Drag to add Rectangle"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
                <button
                    className={css.toolbarButton}
                    onPointerDown={(e) => onToolbarPointerDown(e, "circle")}
                    onPointerMove={onToolbarPointerMove}
                    onPointerUp={onToolbarPointerUp}
                    onPointerCancel={() => setToolbarDrag(null)}
                    title="Drag to add Circle"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
            </div>

            {/* Drag ghost preview */}
            {toolbarDrag && (
                <div
                    className={css.dragGhost}
                    style={{
                        left: toolbarDrag.x,
                        top: toolbarDrag.y,
                        width: toolbarDrag.type === "circle" ? CIRCLE_SIZE : RECT_WIDTH,
                        height: toolbarDrag.type === "circle" ? CIRCLE_SIZE : RECT_HEIGHT,
                        borderRadius: toolbarDrag.type === "circle" ? "50%" : "6px",
                    }}
                />
            )}

            {/* Minimap */}
            <div className={css.map}>
                <div
                    style={{
                        position: "absolute",
                        left: `${miniX}px`,
                        top: `${miniY}px`,
                        width: `${miniW}px`,
                        height: `${miniH}px`,
                        border: "1px solid rgba(12, 86, 223, 0.5)",
                        boxSizing: "border-box",
                        background: "transparent",
                    }}
                />
            </div>
        </section>
    );
};


