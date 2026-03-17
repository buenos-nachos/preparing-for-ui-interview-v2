# Portfolio Visualizer — UX

**Difficulty**: ⭐⭐ Medium · **Time**: 20–30 min

## What You'll Learn

- Recursive tree rendering with `<details>` / `<summary>`
- Percentage calculation relative to root total
- Using `data-*` attributes on inputs for identification
- Recursive component composition

## Goal

Build the **UI layer** for a portfolio visualizer that displays a hierarchical tree of assets. Each node shows its name, an editable value input, and a computed percentage of the total. This problem focuses only on rendering — logic (state, events, validation) is covered in Problem 54.

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

1. Render a tree of portfolio nodes using `<details>` / `<summary>` (collapsible).
2. Each node displays: **name**, **editable value** (`<input type="number">`), and **percentage** of root total.
3. Percentage = `(node.value / root.value) * 100`, formatted to 2 decimal places.
4. Each `<input>` should have a `data-node-id` attribute set to the node's `id` (used by Problem 54 for event delegation).
5. Children are rendered recursively inside the parent's `<details>`.

## API Design

```ts
type TPortfolioNode = {
  id: string
  name: string
  value: number
  children?: TPortfolioNode[]
}

type TPortfolioVisualizerProps = {
  data: TPortfolioNode // root node
}
```

## Walkthrough

### Step 1 — PortfolioNode component

Create a recursive `PortfolioNode` component that receives a node's props plus a `total` (root value). It renders:

- `<details open>` as the container
- `<summary>` with the node name (`<strong>`), an `<input type="number">` with `data-node-id={id}` and `defaultValue={value}`, and an `<output>` showing the percentage
- Recursively renders children, passing the same `total` to each

### Step 2 — PortfolioVisualizer

The main component simply wraps the root `PortfolioNode` in a container div, passing `data.value` as the `total`.

### 💡 Hint — Why defaultValue instead of value?

Using `defaultValue` makes the input uncontrolled — it renders the initial value but allows the user to type freely without needing an onChange handler. Problem 54 will add event delegation on the container to handle changes.



## Edge Cases

| Scenario                | Expected                                     |
| ----------------------- | -------------------------------------------- |
| Root has no children    | Just a single node with 100.00%              |
| All values = 0          | Percentages show 0.00% (no division by zero) |
| Deeply nested tree      | All levels render correctly                  |
| Node with empty children array | No children rendered, still collapsible |

## Verification

1. Tree renders with correct values and percentages.
2. Collapse/expand nodes with `<details>`.
3. Percentages are correct relative to root total.
4. Each input has the correct `data-node-id` attribute.
