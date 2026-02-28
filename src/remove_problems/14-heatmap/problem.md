# Heatmap Canvas

**Difficulty**: `medium`

## Goal

Implement a Heatmap component using HTML5 Canvas to visualize data density on a grid. The component should support dynamic resizing, efficient rendering, and accumulation of data points.

## Requirements

### Core Functionality

1.  **Grid Visualization**: Render a grid where each cell represents a coordinate area.
2.  **Data Accumulation**: Support adding data points (`x`, `y`, `value`). If multiple points land on the same cell, their values should accumulate (clamped to a max of 1.0).
3.  **Intensity Rendering**: Visualize cell value using opacity (e.g., Red with varying alpha).
4.  **Responsive Resolution**: The canvas internal resolution should automatically sync with its CSS display size to ensure crisp rendering on all screen sizes.
5.  **Interactive Updates**: Provide an API to add points dynamically.

### Shared Logic

- Extract the core rendering and state management logic into a reusable `HeatmapChart` class to be shared between React and Vanilla implementations.

## API Design

### Props / Configuration

- `size`: `number` (optional, default `100`) - The conceptual resolution of the grid (number of cells along the axis).

### Exposed Methods

- `addPoint(x: number, y: number, value: number): void` - Adds a data point to the heatmap.

## Solution Approach

### 1. `HeatmapChart` (Shared Logic)

- **State**: Uses a `Map<string, Point>` to store aggregated values for each grid coordinate (`"x-y"`).
- **Rendering**:
  1.  Clear Canvas.
  2.  Calculate cell dimensions based on current canvas size and padding.
  3.  Draw all Points (filling cells with `rgba(255, 0, 0, value)`).
  4.  Draw Grid lines on top.
- **Optimization**: Uses `getBoundingClientRect` to determine render area.

### 2. React Implementation

- **Wrappers**: uses `useLayoutEffect` to manage the `HeatmapChart` instance.
- **ResizeObserver**: Observes the parent container to resize the canvas buffer keying `width`/`height` to `contentRect`.
- **Ref Forwarding**: uses `useImperativeHandle` to expose `addPoint`.

### 3. Vanilla Implementation

- **Component Class**: Extends base `Component`.
- **DOM**: Manually creates `<canvas>` and manages `ResizeObserver`.

## Verification

1.  **Grid Rendering**: Grid lines should be visible and evenly spaced.
2.  **Data Points**: Adding points should fill corresponding cells red.
3.  **Accumulation**: Adding multiple points to the same spot should make it darker/more opaque.
4.  **Resizing**: Resizing the window/container should adjust the grid and point sizes without blurring.
