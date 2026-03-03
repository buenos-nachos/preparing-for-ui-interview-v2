# Portfolio Visualizer — Logic

**Difficulty**: 🚀 Extreme · **Time**: 45–60 min

## What You'll Learn

- Separating business logic from UI (MVC / headless pattern)
- Observable state with event emitters
- Derived computations (percentages, totals)
- Framework-agnostic engine that works with both React and Vanilla

## Goal

Build the **logic engine** for the Portfolio Visualizer (from 16.1) as a standalone class. The engine manages the tree state, handles value updates with parent bubbling, and emits change events so any UI layer can subscribe.

```
┌─────────────────────────────────────────────┐
│              PortfolioEngine                 │
│                                             │
│  store: Map<id, Node>                       │
│  rootId: string                             │
│                                             │
│  setValue(id, value)                         │
│    ├─ validate (≥ child sum)                │
│    ├─ update node                           │
│    ├─ bubble up parent chain                │
│    └─ emit('change')                        │
│                                             │
│  getPercentage(id) → number                 │
│  getNode(id) → Node                         │
│  on('change', callback)                     │
│  off('change', callback)                    │
└─────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
   React Component      Vanilla DOM
   (subscribes via       (subscribes via
    useEffect)            addEventListener)
```

## Requirements

### Core Functionality

1. **Initialize** from a nested tree → normalize into flat `Map<id, Node>`.
2. **`setValue(id, value)`**: Update a node's value, validate, bubble up, emit change.
3. **`getPercentage(id)`**: Return `(node.value / root.value) * 100`.
4. **`getNode(id)`**: Return the node data.
5. **Event system**: `on(event, cb)` / `off(event, cb)` for subscribing to changes.

### Validation Rules

- If node has children: new value must be ≥ sum of children values.
- If validation fails: reject the update (no state change, no event).

### Bubble-Up Algorithm

```
setValue("aapl", 4000)
  │
  ▼
Update "aapl".value = 4000
  │
  ▼
Walk parent chain:
  "stocks".value = sum(aapl, googl, msft) = 4000 + 2000 + 1000 = 7000
  "portfolio".value = sum(stocks, bonds) = 7000 + 4000 = 11000
  │
  ▼
emit('change')
```

## API Design

```ts
class PortfolioEngine {
  constructor(data: TPortfolioNode)

  setValue(id: string, value: number): void
  getNode(id: string): TPortfolioStateNode
  getPercentage(id: string): number
  getRootId(): string

  on(event: 'change', callback: () => void): void
  off(event: 'change', callback: () => void): void
}
```

## Walkthrough

### Step 1 — Normalize in constructor

```ts
constructor(data) {
  this.store = new Map()
  this.rootId = data.id
  this.#normalize(data, null)
}

#normalize(node, parentID) {
  this.store.set(node.id, { ...node, parentID })
  node.children?.forEach(child => this.#normalize(child, node.id))
}
```

### Step 2 — setValue with validation and bubbling

```ts
setValue(id, value) {
  const node = this.store.get(id)
  if (node.children?.length) {
    const childSum = node.children.reduce((s, c) => s + this.store.get(c.id).value, 0)
    if (value < childSum) return  // reject
  }
  node.value = value
  this.#bubbleUp(node)
  this.#emit('change')
}
```

### Step 3 — Event emitter

```ts
#listeners = new Map<string, Set<Function>>()

on(event, cb) {
  if (!this.#listeners.has(event)) this.#listeners.set(event, new Set())
  this.#listeners.get(event).add(cb)
}

off(event, cb) { this.#listeners.get(event)?.delete(cb) }

#emit(event) { this.#listeners.get(event)?.forEach(cb => cb()) }
```

### Step 4 — Connect to React

```tsx
const [, forceRender] = useState(0)
useEffect(() => {
  const handler = () => forceRender(n => n + 1)
  engine.on('change', handler)
  return () => engine.off('change', handler)
}, [engine])
```

<details>
<summary>💡 Hint — Why separate logic from UI?</summary>

This pattern (sometimes called "headless" or "logic-only") lets you:
- Test business logic without rendering
- Reuse the same engine in React, Vanilla, Vue, etc.
- Keep components thin (just rendering + event wiring)

It's the same pattern used by TanStack Table, Headless UI, and many production libraries.
</details>

## Edge Cases

| Scenario | Expected |
|---|---|
| Set leaf value | Parents recalculate, event emits |
| Set parent below child sum | Rejected, no event |
| Set root value (no parent) | Updates, no bubbling needed |
| Multiple rapid updates | Each triggers change event |
| All values = 0 | getPercentage returns 0 (no NaN) |

## Verification

1. Create engine with test data.
2. `setValue("aapl", 4000)` → `getNode("stocks").value === 7000`.
3. `getPercentage("aapl")` returns correct value.
4. `on('change', spy)` → spy called after setValue.
5. Invalid setValue → no change, no event.
