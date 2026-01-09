# Table Component

**Difficulty**: `medium`

## Goal
Build a data table component that supports displaying structured data with support for sorting, pagination, and filtering.

## Requirements

### Core Functionality
1.  **Columns**: Accept a configuration array for columns, defining header names, ids, and custom renderers for cell content.
2.  **Pagination**: Display specific number of rows per page. Provide "Next" and "Previous" buttons and display current page info (e.g., "1 / 5").
3.  **Sorting**: Allow clicking on headers to sort the table by that column (Ascending -> Descending -> None). Visual indicators (↑/↓) should show sort direction.
4.  **Filtering**: Provide a search input to filter rows based on content.

### Accessibility (A11y)
1.  Use semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` elements.
2.  Interactive headers should be keyboard accessible (if implemented as buttons) or natively clickable.
3.  Pagination controls should utilize `button` elements with proper disabled states.

## API Design

The component should accept the following props:

-   `columns`: `TTableColumn<T>[]` - Array of column definitions.
    -   `id`: `string` - Unique identifier.
    -   `name`: `string` - Header display text.
    -   `renderer`: `(item: T) => ReactNode` - Function to render cell content.
    -   `sort`: `'asc' | 'desc' | 'none'` - Current sort state.
-   `data`: `T[]` - Array of data items to display.
-   `currentPage`: `number` - 0-indexed current page number.
-   `totalPages`: `number` - Total number of pages.
-   `next`: `() => void` - Callback for next page.
-   `prev`: `() => void` - Callback for previous page.
-   `sort`: `(columnId: keyof T, direction: SortDirection) => void` - Callback for sorting.
-   `search`: `(query: string) => void` - Callback for search input changes.

## Solution Approach

1.  **State Management**: Use `useState` (or a custom hook) to manage `columns` (for sort state), `page`, and `query`.
2.  **Data Transformation**:
    -   Filter data based on `query`.
    -   Sort data based on active column sort state.
    -   Paginate data (slice) based on `page` and `pageSize` (if handling client-side pagination) or pass pre-paginated data.
3.  **Rendering**: Map over `columns` to render headers and `data` to render rows.

