# Tabs Component

**Difficulty**: 🟢 Easy · **Time**: 10–15 min

## What You'll Learn

- Compound component pattern (`Tabs` + `Tab`)
- Controlled state with `useState`
- React Portals for rendering content outside the component tree
- Event delegation with `data-*` attributes

## Goal

Build a tabs component where clicking a tab header switches the visible content panel. Optionally support rendering the content into a **portal target** (a DOM element outside the component tree).

```
┌──────┬──────┬──────┐
│ Tab1 │ Tab2 │ Tab3 │    ← tab headers (nav)
└──────┴──┬───┴──────┘
          │ active
  ┌───────▼──────────────┐
  │                      │
  │  Content for Tab2    │  ← content panel
  │                      │
  └──────────────────────┘
```

## Requirements

### Core Functionality

1. Render tab headers from child `<Tab>` elements.
2. Clicking a tab header switches the active tab and displays its content.
3. Accept a `defaultTab` prop to set the initially active tab.
4. If no `defaultTab`, default to the first tab.

### Portal Support

1. Accept an optional `target` ref (`RefObject<HTMLElement>`).
2. When `target` is provided, render the active tab's content into that DOM element using `createPortal`.
3. When `target` is not provided, render content inline below the tabs.

### Accessibility

1. Use semantic `<nav>` / `<ul>` / `<li>` for the tab list.
2. Tab headers should be `<button>` elements for keyboard support.

## API Design

```ts
// Tab — a single tab definition
type TTabProps = PropsWithChildren<{
  name: string  // unique tab identifier & display label
}>

// Tabs — the container
type TTabsProps = {
  defaultTab?: string                          // initially active tab name
  target?: RefObject<HTMLElement>              // portal target
  children: ReactElement<TTabProps, typeof Tab>[]
}
```

**Usage:**
```tsx
<Tabs defaultTab="Profile">
  <Tab name="Home">Home content here</Tab>
  <Tab name="Profile">Profile content here</Tab>
  <Tab name="Settings">Settings content here</Tab>
</Tabs>
```

## Walkthrough

### Step 1 — Track active tab

Use `useState` initialized to `defaultTab` or `children[0].props.name`.

### Step 2 — Render tab headers

Map over `children` and render each `<Tab>` inside a `<ul>`. Each tab renders a `<button>` with `data-tab-name={name}`.

### Step 3 — Handle clicks with event delegation

Attach a single `onClick` handler on the `<ul>`. Check if the target is an `HTMLButtonElement`, read `dataset.tabName`, and call `setActiveTab`.

### Step 4 — Render content

Find the child whose `name` matches `activeTab` and render its `children`:
- If `target?.current` exists → use `createPortal(content, target.current)`
- Otherwise → render inline in a `<section>`

<details>
<summary>💡 Hint — Why compound components?</summary>

The `<Tabs>` + `<Tab>` pattern lets consumers declare tabs declaratively in JSX. The parent (`Tabs`) reads each child's props to build the header list and find the active content. This is the same pattern used by libraries like Radix UI and Headless UI.
</details>

## Edge Cases

| Scenario | Expected |
|---|---|
| Single tab | Renders normally, always active |
| `defaultTab` doesn't match any child | Falls back to first tab |
| Portal target not yet mounted | Renders content inline |
| Tab content is complex JSX | Works — children can be any ReactNode |

## Verification

1. Click each tab → content switches.
2. Default tab is selected on mount.
3. With a portal target → content renders in the target element.
4. Keyboard: Tab to header, Enter/Space activates it.
