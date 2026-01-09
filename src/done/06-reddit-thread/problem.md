# Reddit Thread Component

**Difficulty**: `medium`

## Goal
Build a recursive comment thread component similar to Reddit, supporting nested comments and collapse/expand functionality.

## Requirements

### Core Functionality
1.  **Recursive Rendering**: Display comments and their nested replies in a hierarchical tree structure.
2.  **Collapsible Threads**: Allow users to collapse and expand comment threads. Collapsing a parent comment should hide all its descendants.
3.  **Indentation**: Visual indentation should clearly indicate the nesting level of comments.

### Accessibility (A11y)
1.  Use semantic `<article>` for comments.
2.  Use `<details>` and `<summary>` for native expand/collapse behavior, or manage `aria-expanded` state manually if building custom controls.
3.  Ensure focus management works correctly when expanding/collapsing.

## API Design

The component should accept the following props:

-   `comments`: `IRedditComment[]` - The root array of comments.

**IRedditComment Interface**:

```typescript
interface IRedditComment {
    id: string;
    nickname: string;
    text: string;
    date: string;
    replies: IRedditComment[];
}
```

## Solution Approach

1.  **Recursion**: Create a `Comment` component that renders itself for each item in the `replies` array.
2.  **HTML Structure**: Use `<ul>` and `<li>` for the structure to ensure accessibility of list items.
3.  **Styling**: Use left padding or margin to create the visual nesting effect.

