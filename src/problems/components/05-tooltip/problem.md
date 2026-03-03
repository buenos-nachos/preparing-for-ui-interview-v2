# Tooltip

**Difficulty**: 🟢 Easy · **Time**: 15–20 min

## What You'll Learn

- Coordinate math with `getBoundingClientRect()`
- CSS absolute positioning relative to a trigger element
- Auto-positioning logic (flip when clipped by boundary)
- ARIA `tooltip` role and `aria-describedby`

## Goal

Build a tooltip that appears on hover/focus near a trigger element. Support fixed positions (`top`, `bottom`, `left`, `right`) and an `auto` mode that picks the best position based on available space.

```
                  ┌───────────┐
                  │  Tooltip  │   ← position: top
                  └─────┬─────┘
                        │ 8px offset
                  ┌─────▼─────┐
                  │  Trigger   │
                  └───────────┘

  ┌───────────┐                   ┌───────────┐
  │  Tooltip  │──8px──│ Trigger │──8px──│  Tooltip  │
  └───────────┘       └─────────┘       └───────────┘
    left                                  right
```

## Requirements

### Core Functionality

1. Show tooltip on **mouse enter** and **focus**; hide on **mouse leave** and **blur**.
2. Support `position` prop: `'top' | 'bottom' | 'left' | 'right' | 'auto'`.
3. Position the tooltip with an 8px offset from the trigger.
4. **Auto mode**: try positions in order (top → right → bottom → left) and pick the first one that fits within the boundary.

### Auto-Positioning Algorithm

```
For each candidate position (top, right, bottom, left):
  1. Calculate tooltip (x, y) based on trigger rect
  2. Check: does the tooltip fit within the boundary rect?
     - x >= boundary.left
     - y >= boundary.top
     - x + tooltipWidth <= boundary.right
     - y + tooltipHeight <= boundary.bottom
  3. If it fits → use this position
  4. If none fit → fall back to 'top'
```

**Coordinate formulas:**

| Position | x | y |
|---|---|---|
| top | `trigger.left + trigger.width/2 - tooltip.width/2` | `trigger.top - tooltip.height - 8` |
| bottom | `trigger.left + trigger.width/2 - tooltip.width/2` | `trigger.bottom + 8` |
| left | `trigger.left - tooltip.width - 8` | `trigger.top + trigger.height/2 - tooltip.height/2` |
| right | `trigger.right + 8` | `trigger.top + trigger.height/2 - tooltip.height/2` |

### Boundary

- Accept an optional `boundary` prop (ref or HTMLElement).
- If provided, use its `getBoundingClientRect()` as the constraint.
- If not provided, use the viewport (`{ left: 0, top: 0, right: innerWidth, bottom: innerHeight }`).

### Accessibility

1. Use `role="tooltip"` on the tooltip element.
2. Set `aria-describedby` on the trigger pointing to the tooltip's `id`.
3. Close on Escape key.

## API Design

```ts
type TooltipProps = {
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  children: React.ReactNode       // trigger element
  content: React.ReactNode        // tooltip content
  boundary?: RefObject<HTMLElement> | HTMLElement
}
```

## Walkthrough

### Step 1 — Show/hide state

Track `isVisible` with `useState`. Set it on `mouseenter`/`focus` and clear on `mouseleave`/`blur`.

### Step 2 — Render tooltip with CSS positioning

Use `position: relative` on the container and `position: absolute` on the tooltip. Apply CSS classes for each position (top/bottom/left/right) that set the correct `top`/`left`/`transform`.

### Step 3 — Auto-positioning with `useEffect`

When `position === 'auto'` and the tooltip becomes visible:
1. Get `tooltipRef.current.getBoundingClientRect()`
2. Get `containerRef.current.getBoundingClientRect()`
3. Get boundary rect
4. Run the candidate check and update position state

<details>
<summary>💡 Hint — Why useEffect for auto-positioning?</summary>

You need the tooltip to be rendered in the DOM first (to measure its size with `getBoundingClientRect()`), then reposition it. This is a classic "measure after render" pattern. The tooltip briefly renders at the default position, then `useEffect` fires and moves it to the correct position.
</details>

<details>
<summary>💡 Hint — CSS-only vs JS positioning</summary>

For fixed positions (top/bottom/left/right), pure CSS with `position: absolute` and transforms works great. Auto-positioning requires JS because you need to measure actual pixel dimensions and compare against the boundary.
</details>

## Edge Cases

| Scenario | Expected |
|---|---|
| Trigger near viewport edge | Auto mode flips to a position that fits |
| No position fits | Falls back to `top` |
| Tooltip content changes size | Repositions on next show |
| Escape key pressed | Tooltip hides |
| Focus then hover | Tooltip stays visible (both triggers active) |

## Verification

1. Hover trigger → tooltip appears at specified position.
2. Move mouse away → tooltip disappears.
3. Set `position="auto"`, place trigger near edge → tooltip flips.
4. Tab to trigger → tooltip appears (focus).
5. Press Escape → tooltip hides.
