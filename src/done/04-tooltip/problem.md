# Tooltip

**Difficulty**: `easy`

## Goal
Implement a `Tooltip` component that displays additional information when a user interacts with an element (hover or focus). It should support customizable positioning and behave accessibly.

## Requirements

### Core Functionality
1. **Triggering**: The tooltip should appear on `mouseenter` and `focusin` events, and disappear on `mouseleave`, `focusout`, and `Escape` key press.
2. **Positioning**:
    - Support explicit positions: `top`, `bottom`, `left`, `right`.
    - Support `auto` positioning: Automatically choose the best position based on available viewport space.
3. **Content**: Accept arbitrary HTML content (string for Vanilla, ReactNode for React) for the tooltip body.
4. **Resiliency**: Handle edge cases where the tooltip might overflow the viewport.

### Accessibility (A11y)
1. **Roles**: The tooltip container should have `role="tooltip"`.
2. **Keyboard Navigation**:
    - The trigger element must be keyboard focusable.
    - Tooltip should open on focus.
    - Pressing `Escape` should close the tooltip.
3. **ARIA**: Use `aria-describedby` on the trigger element pointing to the tooltip ID when visible.

## API Design

The component should accept the following props (React) or config (Vanilla):

- `children` (`HTMLElement` | `ReactNode`): The trigger element.
- `content` (`string` | `ReactNode`): The content to display inside the tooltip.
- `position` (`'top' | 'bottom' | 'left' | 'right' | 'auto'`): Preferred position. Defaults to `'top'`.

## Solution Approach

1. **State Management**: Track visibility state (`isVisible`).
2. **Event Listeners**:
    - Bind `mouseenter`/`mouseleave` to show/hide.
    - Bind `focusin`/`focusout` to show/hide (bubbling events are crucial).
    - Bind `keydown` to listen for `Escape`.
3. **Positioning Logic**:
    - Use absolute positioning relative to a container.
    - For `auto`, calculate available space in all 4 directions using `getBoundingClientRect()` and the viewport dimensions.
    - Switch class names or styles dynamically based on the chosen position.

### Auto Positioning Logic

The `auto` positioning algorithm attempts to place the tooltip in the following order of preference, checking if there is sufficient space in the viewport:

1.  **Top**: Default preference.
2.  **Right**: If Top fails.
3.  **Left**: If Right fails.
4.  **Bottom**: If Left fails.
5.  **Fallback (Top)**: If all fail.


### Positioning Visualized

The following diagrams illustrate how we determine if there is enough space in the Viewport.

#### Viewport & Coordinates

```text
(0,0) -----------------------------------------------------> X
  |
  |      VIEWPORT (window.innerWidth x window.innerHeight)
  |
  |          Top Space?
  |      [________________]
  |      |                |
  | Left |    TRIGGER     | Right
  | Space|   ELEMENT      | Space?
  |      |________________|
  |
  |          Bottom Space?
  |
  v Y
```

#### Verification Logic

To check if a position fits, we compare the potential tooltip edges against the viewport boundaries (0, 0, innerWidth, innerHeight).

```text
    ┌───────────────────────────┐
    │          Tooltip          │
    │  (Width x Height)         │
    └─────────────┬─────────────┘
                  │
        ┌─────────┴─────────┐
        │      Trigger      │
        └───────────────────┘

CHECK RIGHT:
Trigger.right + Tooltip.width  <=  window.innerWidth

CHECK BOTTOM:
Trigger.bottom + Tooltip.height <=  window.innerHeight

CHECK LEFT:
Trigger.left - Tooltip.width  >=  0

CHECK TOP:
Trigger.top - Tooltip.height  >=  0
```

## Test Cases

1. **Hover Test**: Mouse over the trigger -> Tooltip appears. Mouse out -> Tooltip disappears.
2. **Focus Test**: Tab to trigger -> Tooltip appears. Tab away -> Tooltip disappears.
3. **Auto Position Test**: Scroll the page or move the viewport such that the preferred position is blocked. Verify the tooltip flips to an available side.
4. **Escape Key**: Focus the trigger, press Escape -> Tooltip disappears.
