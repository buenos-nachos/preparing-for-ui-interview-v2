# 19.6 Google Sheet: Virtualized UI & Event Delegation

**Difficulty**: `Extreme`  
**Estimated Time**: 45–60 minutes

## Goal

Take your logic engine and turn it into a **high-performance spreadsheet UI**. The challenge here is performance: you must support thousands of cells while maintaining smooth scrolling and instant updates.

> **What you'll learn**: Row virtualization for large grids, event delegation for efficient DOM handling, and imperative DOM updates for maximum performance.

## The Big Picture

```text
 19.1          19.2           19.3          19.4         19.5       19.6
┌──────┐    ┌─────────┐    ┌────────┐    ┌──────┐    ┌──────────┐ ┌────┐
│ Data │───►│ Compile │───►│ Topo   │───►│ Eval │───►│Recompute │►│ UI │
│Struct│    │ & Deps  │    │ Sort   │    │      │    │ Pipeline │ │    │
└──────┘    └─────────┘    └────────┘    └──────┘    └──────────┘ └────┘
                                                                   ▲ YOU
                                                                   ARE HERE
```

## Background: Why These Techniques?

### The Problem with Naive Rendering

A 50×50 grid = 2,500 cells. If each cell is a React component with its own state:

```text
Naive approach:
  2,500 React components
  × re-render on every scroll
  × re-render on every cell edit (dependency cascade)
  = 😱 Laggy, unusable UI
```

We solve this with three techniques:

### 1. Fixed-Row Virtualization

Only render the rows currently visible in the viewport. The rest are "virtual" — they exist in data but not in the DOM.

```text
  Total grid: 100 rows × 30px = 3000px tall

  ┌─────────────────────────┐
  │  Scroll container        │
  │  (overflow: auto)        │
  │                          │
  │  ┌─────────────────────┐ │
  │  │ Spacer div           │ │  ← height: 3000px (total)
  │  │                      │ │
  │  │  ╔══════════════════╗│ │
  │  │  ║ Row 15           ║│ │  ← Only visible rows
  │  │  ║ Row 16           ║│ │    are rendered as
  │  │  ║ Row 17           ║│ │    actual DOM elements
  │  │  ║ Row 18           ║│ │
  │  │  ║ Row 19           ║│ │
  │  │  ╚══════════════════╝│ │
  │  │                      │ │
  │  └─────────────────────┘ │
  └─────────────────────────┘

  Algorithm:
    startRow = Math.floor(scrollTop / ROW_HEIGHT)
    endRow   = startRow + Math.ceil(viewportHeight / ROW_HEIGHT)

    Only render rows [startRow ... endRow]
    Position them with: top = row * ROW_HEIGHT
```

### 2. Event Delegation

Instead of attaching `onFocus`, `onBlur`, `onChange` to every cell, attach **one handler** to the grid parent:

```text
  ┌─────────────────────────────────┐
  │ Grid Parent                      │
  │ onFocusCapture  onBlurCapture    │  ← Single event listener
  │                                  │
  │  ┌──────┐ ┌──────┐ ┌──────┐    │
  │  │ A1   │ │ B1   │ │ C1   │    │  ← Events bubble up
  │  └──────┘ └──────┘ └──────┘    │
  │  ┌──────┐ ┌──────┐ ┌──────┐    │
  │  │ A2   │ │ B2   │ │ C2   │    │
  │  └──────┘ └──────┘ └──────┘    │
  └─────────────────────────────────┘
```

**Why `onFocusCapture` / `onBlurCapture`?** The `Capture` variants fire during the capture phase (parent → child), which is more reliable for delegation than the bubbling phase. Focus/blur events don't bubble natively, but their capture variants do.

### 3. Imperative DOM Updates

When a cell edit triggers a cascade of changes, **don't re-render React**. Instead, update the DOM directly:

```text
  User edits A1 → engine.setRaw("A1", "20")
                → returns { changed: ["A1", "B1", "C1"] }

  For each changed ID:
    const el = document.querySelector(`[data-cell-id="${id}"]`)
    el.textContent = engine.getValue(id)

  Result: 3 DOM updates, zero React re-renders ⚡
```

## Requirements

### 1. Component Implementation

#### State Management

- Keep the `TableEngine` instance in a `useRef` or `useMemo` (it should NOT trigger re-renders).
- Use a state variable for `scrollOffset` to trigger re-renders only during scrolling (for virtualization).

#### Layout Structure

```text
  ┌───┬──────┬──────┬──────┬──────┐
  │   │  A   │  B   │  C   │  D   │  ← Column headers (fixed)
  ├───┼──────┼──────┼──────┼──────┤
  │ 1 │      │      │      │      │  ← Row number + cells
  │ 2 │      │      │      │      │
  │ 3 │      │      │      │      │
  │...│      │      │      │      │
  └───┴──────┴──────┴──────┴──────┘
```

- Render a **header row** with column letters (A, B, C...).
- Render a **row number column** on the left.
- Use `div[role=grid]` for accessibility.
- Each cell should have a `data-cell-id` attribute (e.g., `data-cell-id="A1"`) for imperative updates.

#### Cell Editing Flow

```text
  DISPLAY MODE                    EDIT MODE
  ┌──────────────┐    focus     ┌──────────────┐
  │ Shows VALUE  │ ──────────► │ Shows RAW    │
  │ e.g., "15"  │              │ e.g., "=B1+5"│
  └──────────────┘    blur      └──────────────┘
                   ◄────────────
                   (commit edit)
```

- **On focus**: Swap the cell's content from `getValue(id)` to `getRaw(id)` so the user sees the formula.
- **On blur**:
  1. Read the new value from the input.
  2. Call `engine.setRaw(id, newValue)`.
  3. Get the `changed` array from the return value.
  4. For each changed ID, use `document.querySelector` to find the cell and update its `textContent` with `engine.getValue(id)`.

#### Keyboard Interaction

- **Enter**: Save the current cell and move focus down to the next row.
- **Escape**: Cancel editing (revert to the previous value).
- **Arrow Keys**: Move the selection between cells (optional but recommended).

## Hints

### 💡 Hint 1: Column letter generation

To convert a column index to a letter: `String.fromCharCode(65 + colIndex)` gives you `A`, `B`, `C`, etc.



### 💡 Hint 2: Cell ID format

Cell IDs follow the pattern `"A1"`, `"B2"`, etc. — column letter + row number (1-indexed).



### 💡 Hint 3: Virtualization with position: absolute

Render each visible row with `position: absolute` and `top: row * ROW_HEIGHT`. The parent container should have `position: relative` and a fixed height equal to `totalRows * ROW_HEIGHT`.



### 💡 Hint 4: contentEditable vs input

You can use either `<input>` elements or `contentEditable` divs for cells. `contentEditable` gives a more spreadsheet-like feel but requires more careful handling of focus and text selection.



## Edge Cases to Consider

- Scrolling rapidly should not cause blank rows or flickering
- Editing a cell while scrolled should correctly identify the cell ID
- A formula cascade that updates cells outside the visible viewport should still update the engine state (even if the DOM elements don't exist yet)
- Pressing Enter on the last visible row should scroll down to reveal the next row

## Testing

There are no unit tests for this step. Verification is visual:

1. Open the development server and navigate to the Google Sheet page.
2. Verify you can **scroll smoothly** through at least 100 rows.
3. Verify that **editing a cell updates all dependent cells** instantly.
4. Verify that **keyboard navigation** (Enter, Escape, Arrow Keys) works correctly.
5. Verify that **formulas display correctly**: the cell shows the computed value, but when focused, it shows the raw formula.
