# Portfolio Visualizer — UX

**Difficulty**: 🚀 Extreme · **Time**: 45–60 min

## What You'll Learn

- Recursive tree rendering with `<details>` / `<summary>`
- Tree data normalization (nested → flat Map with parent references)
- Bidirectional value propagation (child updates bubble to parents)
- Percentage calculation relative to root total
- Event delegation with `onChange` on a container

## Goal

Build a portfolio visualizer that displays a hierarchical tree of assets. Each node shows its name, an editable value input, and a computed percentage of the total. When a child's value changes, all ancestor totals update automatically.

```
▼ Portfolio ($10,000)                    100.00%
  ▼ Stocks ($6,000)                       60.00%
    ▸ AAPL ($3,000)                       30.00%
    ▸ GOOGL ($2,000)                      20.00%
    ▸ MSFT ($1,000)                       10.00%
  ▼ Bonds ($4,000)                        40.00%
    ▸ Treasury ($2,500)                   25.00%
    ▸ Corporate ($1,500)                  15.00%
```

## Requirements

### Core Functionality

1. Render a tree of portfolio nodes using `<details>` / `<summary>` (collapsible).
2. Each node displays: **name**, **editable value** (`<input type="number">`), and **percentage** of root total.
3. **Edit a leaf value** → parent totals recalculate (sum of children).
4. **Edit a parent value** → only allowed if new value ≥ sum of children (validation).
5. Percentage = `(node.value / root.value) * 100`, formatted to 2 decimal places.

### Data Flow

```
User edits AAPL: $3,000 → $4,000

  Before:                          After:
  Portfolio: $10,000 (100%)        Portfolio: $11,000 (100%)
    Stocks:   $6,000 (60%)          Stocks:   $7,000 (63.64%)
      AAPL:   $3,000 (30%)            AAPL:   $4,000 (36.36%)  ← edited
      GOOGL:  $2,000 (20%)            GOOGL:  $2,000 (18.18%)
      MSFT:   $1,000 (10%)            MSFT:   $1,000  (9.09%)
    Bonds:    $4,000 (40%)          Bonds:    $4,000 (36.36%)
```

### Normalization

Convert the nested tree into a flat `Map<id, node>` with `parentID` references for O(1) lookups:

```ts
type TPortfolioStateNode = {
  id: string
  name: string
  value: number
  parentID: string | null
  children?: TPortfolioStateNode[]
}

// Map: "aapl" → { id: "aapl", value: 3000, parentID: "stocks", ... }
```

## API Design

```ts
type TPortfolioNode = {
  id: string
  name: string
  value: number
  children?: TPortfolioNode[]
}

type TPortfolioVisualizerProps = {
  data: TPortfolioNode  // root node
}
```

## Walkthrough

### Step 1 — Normalize with `prepare()`

Recursively walk the tree, creating a flat `Map<id, node>` and setting `parentID` on each node.

### Step 2 — Recursive rendering

Create a `PortfolioNode` component that renders `<details>` with:
- `<summary>`: name + input + percentage output
- Children: recursively render child nodes

Use `data-node-id` on each `<input>` for event delegation.

### Step 3 — Handle value changes

Attach a single `onChange` handler on the container. On change:
1. Read `target.dataset.nodeId` and new value
2. **Validate**: if node has children, ensure new value ≥ sum of children
3. Update the node's value in the Map
4. **Bubble up**: walk the parent chain, recalculating each parent as sum of its children

```ts
let current = node
while (current.parentID) {
  const parent = store.get(current.parentID)
  const childSum = parent.children.reduce((sum, ch) => sum + store.get(ch.id).value, 0)
  store.set(current.parentID, { ...parent, value: childSum })
  current = parent
}
```

<details>
<summary>💡 Hint — Why a flat Map instead of nested state?</summary>

With nested state, updating a deeply nested node requires cloning every ancestor. A flat Map gives O(1) access to any node by ID, and the parent chain walk is simple with `parentID` references.
</details>

## Edge Cases

| Scenario | Expected |
|---|---|
| Edit leaf → parents update | Sum bubbles up to root |
| Edit parent to less than child sum | Rejected (value reverts) |
| Root has no children | Just a single editable node |
| All values = 0 | Percentages show 0.00% (no division by zero) |
| Deeply nested tree | All levels render and update correctly |

## Verification

1. Tree renders with correct values and percentages.
2. Edit a leaf value → parent totals and all percentages update.
3. Try to set parent below child sum → value rejected.
4. Collapse/expand nodes with `<details>`.
5. Percentages always sum to ~100% at each level.
