# Star Rating Component

**Difficulty**: `easy`

## Goal
Build a star rating component that allows users to provide feedback by selecting a rating from 1 to 5 stars. It should support both read-only display and interactive selection modes.

## Requirements

### Core Functionality
1. Render 5 stars by default (configurable count is a plus).
2. Support **controlled** and **uncontrolled** modes.
3. **Interactive Mode**: Hovering over a star should visually highlight it and all preceding stars. Clicking a star should update the selected value.
4. **Read-only Mode**: Display the current rating without hover effects or interactivity.
5. **Visuals**: Filled stars should be visually distinct (e.g., gold/yellow). Empty stars should be outlined or gray.

### Accessibility (A11y)
1. The component should behave like a radio group (`role="radiogroup"`).
2. Each star should act as a radio button (`role="radio"`).
3. Support keyboard navigation: `Tab` to focus, `Arrow Keys` to change selection, `Enter` or `Space` to select.

## API Design

The component should accept the following props:

- `maxStars`: `number` (default: 5) - Total number of stars to render.
- `value`: `number` (optional) - Current rating value (controlled mode).
- `defaultValue`: `number` (optional) - Initial rating value (uncontrolled mode).
- `onChange`: `(value: number) => void` - Callback when rating changes.
- `readOnly`: `boolean` (default: false) - If true, prevents interaction.

## Solution Approach

1. **State Management**: Use internal state for **hover value** and **selection value**. If `value` prop is provided, use it (controlled); otherwise, use internal state.
2. **Rendering**: Loop from 1 to `maxStars`. Determine if a star is "active" based on `hoverValue` (if hovering) or `value` (if not hovering).
3. **Events**: Use `onMouseEnter` to update hover state, `onMouseLeave` to reset it, and `onClick` to trigger `onChange` and update selection.

## Test Cases

1. Renders correct number of stars based on `maxStars`.
2. Clicking the 3rd star updates value to 3.
3. Hovering over 4th star highlights 1-4.
4. `readOnly={true}` prevents hover effects and clicks.
5. Keyboard navigation updates rating.
