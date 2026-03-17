# Progress Bar

**Difficulty**: 🟢 Easy · **Time**: 10–15 min

## What You'll Learn

- CSS `clip-path` for partial text coloring
- Layered rendering (background bar + overlay label)
- CSS transitions for smooth animation
- ARIA attributes for accessibility (`progressbar` role)

## Goal

Build a progress bar that fills from 0% to 100% with a smooth transition. The label text should change color as the bar passes over it — dark text on the unfilled portion, white text on the filled portion.

```
value = 60%:
┌──────────────────────────────────────┐
│████████████████████░░░░░░░░░░░░░░░░░░│
│    60% (white)     │  60% (dark)     │
└──────────────────────────────────────┘
      filled area        unfilled area

The trick: TWO labels stacked on top of each other!
┌──────────────────────────────────────┐
│  "60%" (dark, full width)            │  ← bottom layer
│  "60%" (white, clipped to filled %)  │  ← top layer (clip-path)
└──────────────────────────────────────┘
```

## Requirements

### Core Functionality

1. Accept a `value` prop (0–100) representing the percentage.
2. Display a filled bar that grows/shrinks with the value.
3. Show a label (e.g., `"60%"`) centered on the bar.
4. **Dual-color label**: The label is white over the filled area and dark over the unfilled area.
5. Smooth CSS transition when the value changes.

### The `clip-path` Trick

The key insight is rendering **two copies** of the label:

1. **Bottom label** (dark text): Full width, always visible.
2. **Top label** (white text): Clipped to only show over the filled area.

```css
/* Top label — only visible over the filled portion */
clip-path: inset(0 ${100 - percentage}% 0 0);
```

When `value = 60`:

- `clip-path: inset(0 40% 0 0)` → clips the right 40%, showing only the left 60%

### Accessibility

1. Use `role="progressbar"` on the container.
2. Set `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.
3. Include `aria-label` for screen readers.

## API Design

```ts
type TProgressBarProps = {
  value: number // 0–100
  label?: string // custom label text (default: "${value}%")
}
```

## Walkthrough

### Step 1 — Container and fill bar

Create a container with `position: relative` and a child div for the fill. Set the fill's `width` to `${value}%` with a CSS transition.

```css
.fill {
  width: var(--progress);
  transition: width 0.3s ease;
  background: #4caf50;
}
```

### Step 2 — Bottom label (dark)

Position a label absolutely centered in the container. This is always visible with dark text.

### Step 3 — Top label (white, clipped)

Duplicate the label with white text. Apply `clip-path: inset(0 ${100 - value}% 0 0)` so it only shows over the filled area. Set `aria-hidden="true"` on this duplicate.

### Step 4 — Animate

The `clip-path` and `width` both transition smoothly with CSS transitions.

### 💡 Hint — Why two labels instead of one?

A single label can only have one color. By stacking two labels — one dark (always visible) and one white (clipped to the fill area) — you get the effect of the text changing color as the bar passes over it. This is a common technique used in real progress bars and sliders.



## Edge Cases

| Scenario                     | Expected                                   |
| ---------------------------- | ------------------------------------------ |
| `value = 0`                  | Bar empty, label fully dark                |
| `value = 100`                | Bar full, label fully white                |
| `value = 50`                 | Label is half dark, half white             |
| Value changes rapidly        | CSS transition handles smoothly            |
| `value < 0` or `value > 100` | Clamp to 0–100                             |
| Custom label text            | Displays custom text instead of percentage |

## Verification

1. Set value to 0 → bar empty, label dark.
2. Set value to 50 → bar half-filled, label is half dark / half white.
3. Set value to 100 → bar full, label fully white.
4. Animate value from 0 to 100 → smooth transition.
5. Screen reader announces progress value.
