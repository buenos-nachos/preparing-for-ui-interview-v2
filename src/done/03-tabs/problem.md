# Tabs Component

**Difficulty**: `easy`

## Goal
Build a reusable Tabs component that allows switching between different content views.

## Requirements

### Core Functionality
1. Render a list of tab buttons (`tablist`) and corresponding panels (`tabpanel`).
2. Only one panel should be visible at a time.
3. Clicking a tab should activate it and show its associated panel.

### Accessibility (A11y)
1. Use semantic roles: `tablist`, `tab`, `tabpanel`.
2. Manage focus and keyboard navigation:
    - `Left/Right` arrow keys to navigate between tabs.
    - `Home/End` to jump to first/last tab.
3. Use `aria-selected`, `aria-controls`, and `aria-labelledby` attributes correctly.

## API Design

The component should accept the following props:

- `defaultTab`: `string` - The name/id of the tab selected by default.
- `onChange`: `(tabId: string) => void` - Callback when active tab changes.
- `children`: `ReactNode` - Tab definitions (e.g. `<Tab name="tab1">...</Tab>`).

## Solution Approach

1. Manage active tab state (`useState`).
2. Use Context or `cloneElement` to pass state to child `Tab` components.
3. Implement keyboard event handler for `tablist`.

