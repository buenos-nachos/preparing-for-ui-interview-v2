# Table Component

**Difficulty**: 🟡 Medium · **Time**: 20–25 min

## What You'll Learn

- Generic component pattern (`Table<T>`)
- Async data loading with pagination
- Client-side sorting and filtering pipeline
- Event delegation on `<thead>` for sort clicks
- `useDeferredValue` for search debouncing

## Goal

Build a data table that loads data asynchronously page-by-page, supports column sorting (asc/desc/none), text filtering, and pagination controls.

```
┌──────────────────────────────────────────────┐
│  Name ↑      │  Age       │  Email           │  ← sortable headers
├──────────────┼────────────┼──────────────────┤
│  Alice       │  28        │  alice@mail.com  │
│  Bob         │  34        │  bob@mail.com    │
│  Charlie     │  22        │  charlie@co.uk   │
├──────────────────────────────────────────────┤
│  [ Prev ]  1 / 5  [ Next ]   [Filter: ___]  │  ← controls
└──────────────────────────────────────────────┘
```

## Requirements

### Core Functionality

1. **Async data source**: Accept a `datasource` object with `next(page, pageSize)` that returns a `Promise<T[]>`.
2. **Pagination**: Show Prev/Next buttons and current page indicator. Load new pages on demand.
3. **Sorting**: Click a column header to cycle through `none → asc → desc → none`. Only one column sorted at a time.
4. **Filtering**: Text input filters the loaded data using a provided `search` function.
5. **Column rendering**: Each column defines a custom `renderer` function for flexible cell content.

### Data Pipeline

Data flows through three stages in order:

```
Raw Data  →  Filter  →  Sort  →  Slice (paginate)  →  Render
              │           │          │
              │           │          └─ slice by currentPage × pageSize
              │           └─ sort by active column + direction
              └─ search(query, data) or fallback to id.includes(query)
```

> **Important**: Filter first, then sort, then slice. This ensures sorting applies to filtered results and pagination applies to the sorted+filtered set.

### Accessibility

1. Use semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`.
2. Sort indicators (↑/↓) in column headers.

## API Design

```ts
interface TTableDataSource<T> {
  pageSize: number
  pages: number
  next: (page: number, pageSize: number) => Promise<T[]>
}

type TTableColumn<T> = {
  id: string
  name: string
  renderer: (item: T) => React.ReactNode
  sort?: 'asc' | 'desc' | 'none'
}

type TTableProps<T extends { id: string }> = {
  columns: TTableColumn<T>[]
  datasource: TTableDataSource<T>
  search?: (query: string, data: T[]) => T[]
  comparator?: (columnId: keyof T, direction: 'asc' | 'desc') => (a: T, b: T) => number
}
```

## Walkthrough

### Step 1 — Load initial data

In a `useEffect`, call `datasource.next(0, pageSize)` and store the result in state. Accumulate pages as the user navigates forward.

### Step 2 — Pagination

Track `currentPage` in state. `next()` increments the page and fetches more data if needed. `prev()` decrements (min 0). Disable buttons at boundaries.

### Step 3 — Sorting with event delegation

Attach a single click handler on `<thead>`. Read `target.dataset.columnId` to identify which column was clicked. Cycle the sort direction:

```
Click 1: none → asc  (show ↑)
Click 2: asc  → desc (show ↓)
Click 3: desc → none (no arrow)
```

### Step 4 — Filtering

Use a search `<input>` that updates a query string. Wrap with `useDeferredValue` to avoid blocking the UI on every keystroke. Reset to page 0 when the query changes.

### Step 5 — Compose the pipeline with `useMemo`

```ts
const slice = useMemo(() => {
  return [filterFn, sortFn, sliceFn]
    .reduce((acc, fn) => fn(acc), data)
}, [data, query, sort, currentPage, ...])
```

### 💡 Hint — Why accumulate data instead of replacing?

When the user goes to page 2, you fetch page 2 data and **append** it to the existing array. This way, going back to page 1 doesn't require another fetch. The `sliceFn` handles showing only the current page's portion.



### 💡 Hint — Generic components in React

`Table<T>` uses TypeScript generics so the same component works with any data shape. The `columns` prop defines how to render each field, and the `comparator` prop defines how to sort. The constraint `T extends { id: string }` ensures every row has a unique key.



## Edge Cases

| Scenario                | Expected                                         |
| ----------------------- | ------------------------------------------------ |
| Empty data source       | Table renders with no rows                       |
| Filter matches nothing  | Empty table body, no crash                       |
| Sort + filter combined  | Filter first, then sort the filtered results     |
| Rapid page navigation   | No duplicate fetches, data accumulates correctly |
| Page beyond loaded data | Fetches new page automatically                   |

## Verification

1. Table loads first page on mount.
2. Click "Next" → page 2 data appears (fetched if needed).
3. Click "Prev" → back to page 1 (no re-fetch).
4. Click column header → rows sort ascending, click again → descending.
5. Type in filter → rows filter in real-time, page resets to 1.
