# Markdown Editor

**Difficulty**: 🚀 Extreme · **Time**: 60–90 min

## What You'll Learn

- Regex-based text transformation pipeline
- Rule/Pattern architecture for extensible parsing
- Handling nested and mixed formatting (bold + italic + strikethrough)
- Table, list, code block, and image parsing
- Live preview with `dangerouslySetInnerHTML`

## Goal

Build a Markdown-to-HTML parser and a live preview editor. The parser converts a subset of Markdown syntax into HTML using a pipeline of regex-based rules. The editor shows a text area on the left and rendered HTML on the right.

```
┌─────────────────────┬─────────────────────┐
│  # Hello World      │  Hello World         │
│                     │  ─────────────       │
│  This is **bold**   │  This is bold        │
│  and *italic*.      │  and italic.         │
│                     │                      │
│  - Item 1           │  • Item 1            │
│  - Item 2           │  • Item 2            │
│                     │                      │
│  ```js              │  ┌────────────────┐  │
│  const x = 1        │  │ const x = 1    │  │
│  ```                │  └────────────────┘  │
│                     │                      │
│  [Textarea]         │  [Live Preview]      │
└─────────────────────┴─────────────────────┘
```

## Requirements

### Supported Markdown Syntax

| Syntax | HTML Output | Example |
|---|---|---|
| `# Heading` | `<h1>Heading</h1>` | `# Title` → `<h1>Title</h1>` |
| `## Heading` | `<h2>Heading</h2>` | `## Section` → `<h2>Section</h2>` |
| `**bold**` | `<b>bold</b>` | `**text**` → `<b>text</b>` |
| `*italic*` | `<i>italic</i>` | `*text*` → `<i>text</i>` |
| `~~strike~~` | `<s>strike</s>` | `~~text~~` → `<s>text</s>` |
| `***bold italic***` | `<b><i>text</i></b>` | Combined formatting |
| `` `code` `` | `<code>code</code>` | Inline code |
| ` ```lang ... ``` ` | `<pre><code>...</code></pre>` | Code blocks |
| `- item` | `<ul><li>item</li></ul>` | Unordered lists |
| `1. item` | `<ol><li>item</li></ol>` | Ordered lists |
| `[text](url)` | `<a href="url">text</a>` | Links |
| `![alt](src)` | `<img src="src" alt="alt">` | Images |
| `\| table \|` | `<table>...</table>` | Pipe-delimited tables |
| Plain text | `<p>text</p>` | Paragraphs |

### Parser Architecture

The parser uses a **Rule → Pattern** pipeline:

```
Input Markdown
  │
  ▼
┌──────────────────────────────────────────────┐
│  Rule Pipeline (applied in order)            │
│                                              │
│  1. CODE_BLOCK_RULE   (``` ... ```)          │
│  2. IMAGE_RULE        (![alt](src))          │
│  3. LINK_RULE         ([text](url))          │
│  4. HEADER_RULE       (# ## ### ...)         │
│  5. TABLE_RULE        (| ... | ... |)        │
│  6. LIST_RULE         (- item, 1. item)      │
│  7. MIXED_TEXT_RULE   (***~~text~~***)        │
│  8. PARAGRAPH_RULE    (plain text → <p>)     │
│  9. BOLD_RULE         (**text**)             │
│  10. ITALIC_RULE      (*text*)               │
│  11. STRIKETHROUGH_RULE (~~text~~)           │
│  12. INLINE_CODE_RULE (`code`)               │
│  13. HORIZONTAL_RULE  (---)                  │
│                                              │
└──────────────────────────────────────────────┘
  │
  ▼
Output HTML
```

> **Order matters!** Code blocks must be processed first (to protect their content from other rules). Mixed formatting (bold+italic+strike) must come before individual bold/italic rules. Paragraphs must come before inline formatting.

### Core Classes

```ts
class TRichTextPattern {
  regexp: RegExp
  replacer: string | Function
  apply(text: string): string  // text.replace(regexp, replacer)
}

class TRichTextRule {
  name: string
  patterns: TRichTextPattern[]
  apply(text: string): string  // patterns.reduce((acc, p) => p.apply(acc), text)
}

function parseRichText(text: string, rules: TRichTextRule[]): string {
  return rules.reduce((acc, rule) => rule.apply(acc), text)
}
```

## Walkthrough

### Step 1 — Build the Pattern class

A `TRichTextPattern` wraps a regex and a replacer (string or function). Its `apply()` method calls `text.replace(regexp, replacer)`.

### Step 2 — Build the Rule class

A `TRichTextRule` groups related patterns (e.g., all header patterns: h1–h6). Its `apply()` runs all patterns sequentially via `reduce`.

### Step 3 — Define rules in order

Start with the simplest rules (headers, bold, italic) and work up to complex ones (tables, lists, code blocks). Key ordering principles:

1. **Code blocks first** — protect code content from being parsed as markdown
2. **Images before links** — `![alt](src)` must not be caught by `[text](url)`
3. **Mixed formatting before individual** — `***text***` before `**text**` and `*text*`
4. **Paragraphs before inline** — wrap plain lines in `<p>` before applying bold/italic inside them

### Step 4 — Handle complex replacers

Tables and lists need **function replacers** (not simple string templates):

```ts
function TABLE_REPLACER(_, header, __, rows) {
  const headerCells = header.split('|').filter(Boolean)
  const headerHTML = headerCells.map(h => `<th>${h.trim()}</th>`).join('')
  // ... build <thead> and <tbody>
  return `<table><thead><tr>${headerHTML}</tr></thead><tbody>${rowsHTML}</tbody></table>`
}
```

### Step 5 — Build the editor component

- Left pane: `<textarea>` with `onChange` updating state
- Right pane: `<div dangerouslySetInnerHTML={{ __html: parseRichText(text, rules) }}>`
- Use `useMemo` to avoid re-parsing on every render unless text changes

<details>
<summary>💡 Hint — Why regex order matters for headers</summary>

Process `######` (h6) before `#####` (h5) before ... `#` (h1). If you process `#` first, it would match `## Heading` as h1 (consuming the first `#`). Processing from most-specific to least-specific avoids this.
</details>

<details>
<summary>💡 Hint — Avoiding double-processing</summary>

Some rules use negative lookaheads or exclusion patterns to skip content already wrapped in HTML tags. For example, the list rule skips lines containing `<li>` or `<td>` to avoid re-processing table cells as list items.
</details>

## Edge Cases

| Scenario | Expected |
|---|---|
| Empty input | Empty output |
| Nested formatting `***~~text~~***` | `<b><i><s>text</s></i></b>` |
| Code block with markdown inside | Markdown not parsed (preserved as-is) |
| Table with empty cells | Empty `<td></td>` elements |
| Link inside bold `**[text](url)**` | `<b><a href="url">text</a></b>` |
| Multiple paragraphs | Each wrapped in `<p>` |
| Image vs link `![img]()` vs `[link]()` | Correctly distinguished |

## Verification

1. Type `# Hello` → renders as `<h1>`.
2. Type `**bold**` → renders as bold text.
3. Type a code block → renders with syntax highlighting preserved.
4. Type a table → renders as HTML table.
5. Type mixed formatting → all styles applied correctly.
6. All parser tests pass (`bun test markdown`).
