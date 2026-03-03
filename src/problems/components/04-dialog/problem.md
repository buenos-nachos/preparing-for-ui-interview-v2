# Dialog Component

**Difficulty**: 🟢 Easy · **Time**: 10–15 min

## What You'll Learn

- Native `<dialog>` element and `showModal()` API
- `::backdrop` pseudo-element styling
- Focus trapping and Escape key handling (built-in)
- Syncing native dialog state with React state via the `close` event

## Goal

Build a modal dialog using the native HTML `<dialog>` element. The dialog should appear centered with a backdrop overlay, support Confirm/Cancel actions, and close on Escape.

```
┌─────────────────────────────────────────┐
│░░░░░░░░░░░░░░ backdrop ░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░┌─────────────────────────┐░░░░░░░░░│
│░░░░░│                         │░░░░░░░░░│
│░░░░░│   Are you sure?         │░░░░░░░░░│
│░░░░░│                         │░░░░░░░░░│
│░░░░░│   [ Cancel ] [ Confirm ]│░░░░░░░░░│
│░░░░░└─────────────────────────┘░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────────┘
```

## Requirements

### Core Functionality

1. **Modal behavior**: Use `showModal()` to display the dialog (centered, with backdrop, inert background).
2. **Open/Close**: Control via props (React) or methods (Vanilla).
3. **Actions**: Provide Confirm and Cancel buttons that trigger callbacks.
4. **Native close handling**: Listen to the `close` event (fired on Escape) to sync state.

### `<dialog>` API — Key Differences

| | `open` attribute | `showModal()` |
|---|---|---|
| Positioning | Inline (no centering) | Centered by browser |
| Backdrop | ❌ None | ✅ `::backdrop` pseudo-element |
| Focus trap | ❌ No | ✅ Automatic |
| Escape closes | ❌ No | ✅ Fires `close` event |
| Background inert | ❌ No | ✅ Automatic |

> **Always use `showModal()`** for modal dialogs — it gives you accessibility for free.

### Accessibility (A11y)

1. First focusable element receives focus automatically when opened.
2. Escape key closes the dialog (native behavior).
3. Background content is automatically inert (can't Tab to it).

## API Design

### React

```ts
type TDialogProps = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  children: React.ReactNode
}
```

### Vanilla

```ts
type TDialogProps = {
  content: string
  onConfirm: () => void
  onCancel: () => void
}

// Methods
dialog.open()   // calls showModal()
dialog.close()  // calls close()
```

## Walkthrough

### Step 1 — Render the `<dialog>`

Create a `<dialog>` element with your content and two buttons (Cancel, Confirm).

### Step 2 — Sync open state with `showModal()`

```
useEffect:
  if (open)  → dialogRef.current.showModal()
  if (!open) → dialogRef.current.close()
```

> ⚠️ Don't use the `open` HTML attribute — it bypasses modal behavior.

### Step 3 — Handle native close event

The browser fires a `close` event when the user presses Escape. Listen for it and call `onCancel` to sync your React state:

```
<dialog onClose={onCancel}>
```

### Step 4 — Style the backdrop

```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}
```

<details>
<summary>💡 Hint — Common pitfall: dialog won't reopen</summary>

If you call `showModal()` on an already-open dialog, it throws an error. Always check `dialogRef.current.open` before calling `showModal()`, or ensure your `useEffect` only runs when `open` actually changes.
</details>

## Edge Cases

| Scenario | Expected |
|---|---|
| Press Escape | Dialog closes, `onCancel` fires, parent state syncs |
| Click Confirm | `onConfirm` fires, dialog closes |
| Open → Close → Reopen | Works correctly (no stale state) |
| Dialog content overflows | Scrollable within the dialog |
| Multiple rapid open/close | No errors from `showModal()` on already-open dialog |

## Verification

1. Click button → dialog opens centered with backdrop.
2. Click Cancel → dialog closes, state syncs.
3. Press Escape → dialog closes, `onCancel` fires.
4. Click Confirm → `onConfirm` fires, dialog closes.
5. Close and reopen → works correctly.
