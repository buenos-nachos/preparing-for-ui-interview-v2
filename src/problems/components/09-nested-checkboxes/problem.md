# Nested Checkboxes

**Difficulty**: 🔴 Hard · **Time**: 25–30 min

## What You'll Learn

- Tree data structure traversal (recursive)
- Tri-state checkboxes (checked / unchecked / indeterminate)
- Bidirectional propagation: **down** (select children) and **up** (bubble to parents)
- The `indeterminate` DOM property (not an HTML attribute!)

## Goal

Build a nested checkbox tree where selecting a parent checks all its children, and child selections bubble up to update parent state (checked, unchecked, or indeterminate).

```
☑ Fruits                    ← all children checked → parent checked
  ☑ Apple
  ☑ Banana
  ☑ Cherry

☐ Vegetables                ← no children checked → parent unchecked
  ☐ Carrot
  ☐ Broccoli

▣ Grains                    ← some children checked → parent INDETERMINATE
  ☑ Rice
  ☐ Wheat
  ☑ Oats
```

## Requirements

### Core Functionality

1. Render a tree of checkboxes from nested data.
2. **Check a parent** → all descendants become checked.
3. **Uncheck a parent** → all descendants become unchecked.
4. **Check/uncheck a child** → parent updates:
   - All children checked → parent **checked**
   - Some children checked → parent **indeterminate** (▣)
   - No children checked → parent **unchecked**
5. Bubbling continues up to the root.

### Tri-State Logic

```
                    ┌─────────┐
          ┌─────── │  Parent  │ ◄── bubble UP
          │        └─────────┘
          │ propagate DOWN        State rules:
          ▼                       ─────────────
    ┌─────────┐                   all children ☑  → parent ☑
    │ Child 1 │ ☑                 some children ☑ → parent ▣
    │ Child 2 │ ☐                 no children ☑   → parent ☐
    │ Child 3 │ ☑
    └─────────┘
```

### The `indeterminate` Property

> ⚠️ `indeterminate` is a **DOM property**, not an HTML attribute. You cannot set it in JSX. You must use a `ref`:

```tsx
const ref = useRef<HTMLInputElement>(null)
useEffect(() => {
  if (ref.current) {
    ref.current.indeterminate = isIndeterminate
  }
}, [isIndeterminate])
```

## Data Structure

```ts
type TCheckboxItem = {
  id: string
  label: string
  selected?: boolean
  indeterminate?: boolean
  children?: TCheckboxItem[]
  parent?: TCheckboxItem       // back-reference for bubbling
}
```

## Walkthrough

### Step 1 — Normalize the tree

Process the input data to:
1. Build a flat `Record<id, TCheckboxItem>` for O(1) lookups.
2. Set `parent` back-references on each node.
3. Initialize `selected` / `indeterminate` based on children's state.

```ts
function process(acc, item, parent?) {
  acc[item.id] = item
  item.parent = parent
  item.children?.forEach(child => process(acc, child, item))
  // After processing children, derive parent state
  if (item.children?.length) {
    const allChecked = item.children.every(c => c.selected)
    const someChecked = item.children.some(c => c.selected || c.indeterminate)
    item.selected = allChecked
    item.indeterminate = !allChecked && someChecked
  }
}
```

### Step 2 — Propagate DOWN

When a checkbox is toggled, set all descendants to the same value:

```ts
function propagate(children, value) {
  for (const child of children) {
    child.selected = value
    child.indeterminate = false
    propagate(child.children ?? [], value)
  }
}
```

### Step 3 — Bubble UP

After propagating down, walk up the parent chain and recalculate each parent's state:

```ts
function bubble(state, target) {
  if (!target.parent) return
  const parent = target.parent
  const children = parent.children ?? []
  const allChecked = children.every(c => c.selected)
  const someChecked = children.some(c => c.selected || c.indeterminate)
  parent.selected = allChecked
  parent.indeterminate = !allChecked && someChecked
  bubble(state, parent)  // continue up
}
```

### Step 4 — Handle change event

Use event delegation on the `<ul>` container. On change:
1. Clone the state (`structuredClone`)
2. Toggle the target node
3. Propagate down to children
4. Bubble up to parents
5. Set new state

<details>
<summary>💡 Hint — Why structuredClone?</summary>

React requires immutable state updates. Since the tree has circular references (parent ↔ children), you need `structuredClone` which handles circular refs. Spread operator or `JSON.parse(JSON.stringify(...))` won't work here.
</details>

<details>
<summary>💡 Hint — Event delegation with onChangeCapture</summary>

Use `onChangeCapture` on the root `<ul>` to catch all checkbox changes in a single handler. Read `target.dataset.id` to identify which checkbox changed. This avoids attaching handlers to every checkbox.
</details>

## Edge Cases

| Scenario | Expected |
|---|---|
| Leaf node (no children) | Simple check/uncheck, bubble up only |
| Root node (no parent) | Propagate down only, no bubbling |
| All children unchecked then check one | Parent becomes indeterminate |
| Check all children individually | Parent becomes checked |
| Deeply nested tree (5+ levels) | Propagation works through all levels |

## Verification

1. Check a parent → all children checked.
2. Uncheck one child → parent becomes indeterminate (▣).
3. Uncheck all children → parent becomes unchecked.
4. Check a deeply nested child → all ancestors update correctly.
5. Initial data with pre-selected items renders correctly.
