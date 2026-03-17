# Star Rating Component

**Difficulty**: 🟢 Easy · **Time**: 10–15 min

## What You'll Learn

- Controlled component pattern (value + onChange)
- Event delegation on a group of buttons
- ARIA `radiogroup` / `radio` roles for accessibility

## Goal

Build a star rating widget that lets users select a rating from 1 to 5 stars. It should support both **interactive** (clickable) and **read-only** display modes.

```
Interactive mode (value = 3):
  ★ ★ ★ ☆ ☆       ← click star 4 → onChange(4)

Read-only mode (value = 4):
  ★ ★ ★ ★ ☆       ← clicks disabled
```

## Requirements

### Core Functionality

1. Render 5 star buttons (emoji ⭐️).
2. **Controlled mode**: accept `value` and `onChange` props.
3. **Interactive mode**: clicking a star calls `onChange(starValue)`.
4. **Read-only mode**: when `readonly` is true, clicks are disabled.
5. Stars up to and including the selected value should appear "active" (highlighted).

### Accessibility (A11y)

1. Use `role="radiogroup"` on the container with an `aria-label`.
2. Each star should be a `<button>` with `role="radio"` and `aria-checked`.
3. Include a hidden `<input type="number">` to hold the current value for form submission.
4. Set `aria-readonly` when in read-only mode.

## API Design

```ts
type TStarRatingProps = {
  value: number // current rating (1–5)
  onChange: (value: number) => void
  readonly?: boolean // disable interaction
}
```

## Walkthrough

### Step 1 — Render stars

Create an array of 5 items. Map each to a `<button>` with the star emoji. Store the star's numeric value in a `data-star-value` attribute.

### Step 2 — Handle clicks with event delegation

Instead of attaching `onClick` to each button, attach a single handler to the parent container. Use `event.target.closest('button')` to find the clicked star and read its `data-star-value`.

```
Container (onClick) ─────────────────────┐
│  ⭐️ btn[data-star-value=1]             │
│  ⭐️ btn[data-star-value=2]  ← click!  │
│  ⭐️ btn[data-star-value=3]             │
│  ⭐️ btn[data-star-value=4]             │
│  ⭐️ btn[data-star-value=5]             │
└─────────────────────────────────────────┘
         │
         ▼
  closest('button') → data-star-value = 2
  onChange(2)
```

### Step 3 — Visual feedback

Use a `data-active` attribute (or CSS class) on each star. A star is active when `value >= starValue`. Style active vs inactive stars differently via CSS.

### 💡 Hint — Why event delegation?

With 5 buttons, individual handlers work fine. But event delegation is a pattern interviewers love because:

- It scales to any number of stars
- It's a single handler (less memory)
- It demonstrates understanding of event bubbling


## Edge Cases

| Scenario              | Expected                                                     |
| --------------------- | ------------------------------------------------------------ |
| `value = 0`           | No stars highlighted                                         |
| `value = 5`           | All stars highlighted                                        |
| Click same star twice | `onChange` fires with same value (consumer decides behavior) |
| `readonly = true`     | Clicks do nothing, buttons are disabled                      |
| Missing `onChange`    | Should not crash                                             |

## Verification

1. Click star 3 → first 3 stars light up, `onChange(3)` fires.
2. Set `readonly` → clicking does nothing.
3. Tab through stars with keyboard → focus moves between buttons.
4. Screen reader announces "3 Stars, radio, checked" for the selected star.
