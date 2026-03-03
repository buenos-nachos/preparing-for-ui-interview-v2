# Reddit Thread Component

**Difficulty**: 🟡 Medium · **Time**: 15–20 min

## What You'll Learn

- Recursive component rendering (tree → nested UI)
- Data normalization (nested → flat map)
- Expand/collapse state for deeply nested trees
- CSS indentation for visual hierarchy

## Goal

Build a Reddit-style threaded comment view. Comments can have nested replies, forming a tree. Each comment shows its author, text, and a toggle to expand/collapse its children.

```
┌─ user1: "Great post!"
│  ├─ user2: "I agree!"
│  │  └─ user3: "Me too"     ← nested 2 levels deep
│  └─ user4: "Interesting"
│
└─ user5: "Different take..."
   └─ user6: "Explain?"
```

## Requirements

### Core Functionality

1. Render a tree of comments from nested data.
2. Each comment displays: **author**, **text**, and **reply count**.
3. Comments with replies show a **toggle button** to expand/collapse children.
4. Indentation increases with nesting depth (CSS `padding-left`).

### Data Structure

```ts
interface IRedditComment {
  id: string
  author: string
  text: string
  replies: IRedditComment[]  // recursive!
}
```

### Component Architecture

```
RedditThreadComponent({ comments })
  └─ comments.map(comment =>
       RedditComment({ comment })
         ├─ author + text
         ├─ toggle button (if has replies)
         └─ comment.replies.map(reply =>
              RedditComment({ comment: reply })  ← recursion!
            )
     )
```

## Walkthrough

### Step 1 — Recursive component

Create a `RedditComment` component that renders a single comment. If `comment.replies` is non-empty, render a list of `RedditComment` children recursively.

### Step 2 — Expand/collapse

Add a `useState(true)` (or `false`) for each comment's expanded state. Show a toggle button like `[−]` / `[+]` or `▼` / `▶`. When collapsed, hide the replies.

### Step 3 — Visual nesting

Use `padding-left` (e.g., 16px per level) to indent nested comments. A left border line helps visualize the thread structure.

```css
.comment {
  padding-left: 16px;
  border-left: 2px solid #444;
}
```

<details>
<summary>💡 Hint — Normalization (advanced)</summary>

For large trees, you can normalize the data into a flat `Map<id, comment>` with parent references. This makes lookups O(1) and simplifies state updates. However, for this problem, direct recursion on the nested structure is sufficient.
</details>

<details>
<summary>💡 Hint — Event delegation for toggles</summary>

Instead of attaching onClick to every toggle button, you can use a single handler on the container with `data-comment-id` attributes. This is especially useful in the Vanilla implementation.
</details>

## Edge Cases

| Scenario | Expected |
|---|---|
| No replies | No toggle button shown |
| Deeply nested (10+ levels) | Renders correctly with increasing indent |
| Empty comments array | Renders nothing |
| Single comment, no replies | Just the comment, no toggle |
| Collapse parent | All nested children hidden |

## Verification

1. Comments render with correct nesting and indentation.
2. Click toggle → children collapse/expand.
3. Nested replies show correct author and text.
4. Collapsing a parent hides all descendants.
