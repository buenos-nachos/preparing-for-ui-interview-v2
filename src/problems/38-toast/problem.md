# Toast Component

**Difficulty**: 🔴 Hard · **Time**: 25–30 min

## What You'll Learn

- React Context + Provider pattern for global API
- `useImperativeHandle` to expose methods from a child component
- React Portals for rendering outside the component tree
- CSS animations (fade-in / fade-out) with `onAnimationEnd`
- Timer-based auto-dismiss

## Goal

Build a toast notification system. A `ToastProvider` wraps the app and exposes a `useToast()` hook. Calling `toast({ id, text })` renders a notification that auto-dismisses after a timer, with enter/exit animations.

```
App Layout:                          Toast Container (portal):
┌──────────────────────┐             ┌──────────────────┐
│                      │             │  ┌──────────────┐│
│   useToast().toast() ─────────────►│  │ Toast 1  ↑   ││ ← fade in
│                      │             │  └──────────────┘│
│   [Show Toast]       │             │  ┌──────────────┐│
│                      │             │  │ Toast 2  ↓   ││ ← fade out
│                      │             │  └──────────────┘│
└──────────────────────┘             └──────────────────┘
                                       (portal target)
```

## Requirements

### Core Functionality

1. **`ToastProvider`**: Wraps the app, accepts a `target` CSS selector for the portal container.
2. **`useToast()`**: Returns `{ toast(item) }` — the API to show notifications.
3. **Auto-dismiss**: Each toast disappears after a timer (e.g., 3 seconds).
4. **Animations**: Fade-in on appear, fade-out on dismiss.
5. **Stacking**: Multiple toasts stack vertically.

### Architecture

```
ToastProvider
  ├─ ToastContext.Provider (value = { toast })
  │    └─ children (your app)
  │
  └─ createPortal(
       <ToastList ref={toastRef} />,
       targetElement
     )

useToast() → context.toast(item) → toastRef.current.toast(item)
```

### Animation Flow

```
toast() called
  │
  ▼
[fade-in animation] ──onAnimationEnd──► start 3s timer
                                            │
                                            ▼ (3s later)
                                     set removed = true
                                            │
                                            ▼
                                   [fade-out animation] ──onAnimationEnd──► remove from list
```

## API Design

```ts
type TToastItem = {
  id: string
  text: string
}

type TToastMethods = {
  toast: (item: TToastItem) => void
}

// Provider props
{ children: ReactNode, target: string }  // target = CSS selector like "#toast-root"

// Hook
function useToast(): TToastMethods
```

## Walkthrough

### Step 1 — Create Context and Provider

Create a `ToastContext` with a default no-op `toast` function. The `ToastProvider` uses `useLayoutEffect` to find the target DOM element and renders a `ToastList` into it via `createPortal`.

### Step 2 — ToastList with `useImperativeHandle`

The `ToastList` component manages the array of active toasts. Expose a `toast()` method via `useImperativeHandle` so the provider can call it through a ref.

```ts
useImperativeHandle(ref, () => ({
  toast: (item) => setItems((prev) => [...prev, { ...item, removed: false }]),
}))
```

### Step 3 — Animation-driven lifecycle

Use `onAnimationEndCapture` on the list container:

- When fade-in ends (`removed === false`): start the auto-dismiss timer
- When fade-out ends (`removed === true`): remove the item from state

```ts
const onAnimationEnd = ({ target }) => {
  if (target.dataset.removed === 'true') {
    // Remove from list
  } else {
    // Start dismiss timer
    setTimeout(() => markAsRemoved(target.dataset.id), 3000)
  }
}
```

### Step 4 — CSS animations

```css
.fadeIn {
  animation: slideIn 0.3s ease-out;
}
.fadeOut {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
}
@keyframes slideOut {
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}
```

### 💡 Hint — Why useImperativeHandle?

The `ToastList` lives inside a portal, separate from the app tree. The provider needs a way to call `toast()` on it. `useImperativeHandle` exposes methods on a ref, bridging the gap between the context (in the app tree) and the portal (in the DOM).



### 💡 Hint — Why onAnimationEnd instead of setTimeout for removal?

Using `onAnimationEnd` ensures the fade-out animation completes before the element is removed from the DOM. If you use `setTimeout`, the timing might not match the CSS animation duration, causing visual glitches.



## Edge Cases

| Scenario                       | Expected                                            |
| ------------------------------ | --------------------------------------------------- |
| Multiple toasts at once        | Stack vertically, each with independent timer       |
| Toast dismissed during fade-in | Should still fade out properly                      |
| Portal target doesn't exist    | No crash, toasts don't render                       |
| Rapid toast calls              | All toasts appear and dismiss independently         |
| Same ID used twice             | Both render (IDs are for keying, not deduplication) |

## Verification

1. Click "Show Toast" → toast appears with fade-in animation.
2. After 3 seconds → toast fades out and disappears.
3. Show multiple toasts → they stack vertically.
4. Toast renders in the portal target element, not inline.
5. `aria-live="polite"` announces toasts to screen readers.
