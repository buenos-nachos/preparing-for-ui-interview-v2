# Portfolio Visualizer — Logic

**Difficulty**: 🚀 Extreme · **Time**: 45–60 min

## What You'll Learn

- Tree data normalization (nested → flat Map with parent references)
- Budget constraints (parent caps child, children cap parent)
- Derived "Unallocated cash" display
- Event delegation with `onKeyDown` on a container
- Immutable state updates with Map

## Goal

Add the **logic layer** to the Portfolio Visualizer from Problem 53. The UI (PortfolioNode component) is already provided. You need to implement: tree normalization, state management, input validation with budget constraints, and dynamic unallocated cash display.

```
User edits AAPL: $300 → $400

  Before:                          After:
  Portfolio: $1,000 (100%)         Portfolio: $1,000 (100%)
    Stocks:    $600 (60%)            Stocks:    $600 (60%)
      AAPL:    $300 (30%)              AAPL:    $400 (40%)  ← edited
      GOOG:    $300 (30%)              GOOG:    $300 (30%)
      Unallocated cash: 0              (none — fully allocated)
    Bonds:     $400 (40%)           Bonds:     $400 (40%)
    Unallocated cash: 0             Unallocated cash: 0

  Stocks unallocated: $600 - ($400 + $300) = -$100 → REJECTED
  (child cannot exceed parent's unallocated budget)
```

Parent values are **fixed** — they don't bubble up when children change. Instead, the gap between a parent's value and its children's sum is shown as "Unallocated cash".

## Requirements

### Core Functionality

1. **Normalize** the nested tree into a flat `Map<id, node>` with `parentID` and `childrenIDs` references for O(1) lookups.
2. **State**: `useState<Map>` initialized from the normalized data via a `prepare()` function.
3. **onKeyDown handler** (event delegation on container div):
   - Trigger on `Enter` key press on an `<input>` with `data-node-id`
   - **Validate**:
     - Reject `NaN` values
     - If node has children, reject if new value < sum of children values (parent can't go below children)
     - If node has a parent, reject if new value > parent's unallocated budget (child can't exceed available room)
   - On rejection, revert the input to the current stored value
   - On success, create a new Map with the updated node value
4. **Unallocated cash**: When a parent's value > sum of its children, render a read-only "Unallocated cash" indicator showing the remainder.
5. Percentages update automatically since PortfolioNode reads from the store.

### Normalization

Convert the nested tree into a flat `Map<id, node>` where each node stores `parentID` and `childrenIDs` as string references:

```ts
type TPortfolioStateNode = {
  id: string
  name: string
  value: number
  parentID: string | null
  childrenIDs: string[]
}

// Map: "aapl" → { id: "aapl", value: 300, parentID: "stocks", childrenIDs: [] }
// Map: "stocks" → { id: "stocks", value: 600, parentID: "root", childrenIDs: ["aapl", "goog"] }
```

### Budget Constraints

Two rules restrict what values a node can take:

1. **Parent floor**: A parent cannot be reduced below the sum of its children's values.
2. **Child ceiling**: A child cannot be increased beyond its parent's unallocated budget (`parent.value - siblingsSum`).

These constraints mean parent values stay fixed when children change — the "Unallocated cash" absorbs the difference.

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

### Step 1 — Normalize with `prepare()`

Write a `prepare(data)` function that recursively walks the nested tree and returns a flat `Map<string, TPortfolioStateNode>`. Each node stores its `parentID` (string reference to parent, `null` for root) and `childrenIDs` (array of child ID strings). Initialize state with `useState(() => prepare(data))`.

### Step 2 — PortfolioNode component

Each `PortfolioNode` receives `nodeId`, `store`, and `total` (root value for percentage calculation). It:

- Looks up its node from the store by ID — O(1)
- Computes percentage as `(value / total) * 100`
- Uses an uncontrolled `<input>` with `defaultValue` and a `ref` + `useEffect` to sync the displayed value when state changes
- Computes `unallocated = value - childrenSum` and renders "Unallocated cash" when `childrenIDs.length > 0 && unallocated > 0`
- Recursively renders children by their IDs

### Step 3 — Handle value changes with budget constraints

Attach a single `onKeyDown` handler on the container div (event delegation). On Enter key:

1. Read `target.dataset.nodeId` and parse the new value
2. **Validate NaN**: reject and revert input if value is not a number
3. **Parent floor**: if node has children, reject if `childrenSum > newValue`
4. **Child ceiling**: if node has a parent, compute `maxAllowed = parent.value - siblingsSum`; reject if `newValue > maxAllowed`
5. On rejection, revert: `target.value = \`${node.value}\``
6. On success, create a new Map and set the updated node: `new Map(store).set(nodeId, {...node, value})`

```ts
// Child ceiling check
if (node.parentID) {
  const parent = store.get(node.parentID)!
  const siblingsSum = parent.childrenIDs
    .reduce((acc, cid) => acc + (cid === nodeId ? 0 : store.get(cid)!.value), 0)
  const maxAllowed = parent.value - siblingsSum
  if (value > maxAllowed) {
    target.value = `${node.value}`
    return
  }
}
```

### Step 4 — Render

Container div with `onKeyDown={onNodeUpdate}`, render the root PortfolioNode passing `root.value` as `total` so the root always shows 100%.

### 💡 Hint — Why a flat Map instead of nested state?

With nested state, updating a deeply nested node requires cloning every ancestor. A flat Map gives O(1) access to any node by ID, and parent/sibling lookups are simple with `parentID` and `childrenIDs` references. Immutable updates are just `new Map(store).set(id, newNode)`.



### 💡 Hint — Why no parent bubble-up?

Instead of recalculating parent values when children change, parent values stay fixed and the difference is shown as "Unallocated cash". This simplifies the update logic — only the edited node changes — and the budget constraints ensure consistency.



## Edge Cases

| Scenario                              | Expected                                          |
| ------------------------------------- | ------------------------------------------------- |
| Edit leaf value                       | Only that node updates; parent stays fixed         |
| Reduce parent below children sum      | Rejected (value reverts)                          |
| Increase child beyond parent budget   | Rejected (value reverts)                          |
| Parent value > children sum           | "Unallocated cash" shown with the remainder       |
| Parent value = children sum           | No "Unallocated cash" displayed                   |
| Root has no children                  | Just a single editable node, 100%                 |
| All values = 0                        | Percentages show 0.00% (no division by zero)      |
| Enter NaN (e.g. "abc")               | Rejected, input reverts to stored value           |
| Deeply nested tree                    | All levels render and validate correctly          |

## Verification

1. Edit a leaf value → only that node's value changes, percentages update.
2. Try to set parent below child sum → value rejected, input reverts.
3. Try to increase child beyond parent's unallocated budget → rejected.
4. Increase parent value → "Unallocated cash" appears showing the gap.
5. Percentages are always relative to root value (root shows 100%).
