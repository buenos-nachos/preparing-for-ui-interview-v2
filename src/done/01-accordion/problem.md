# Accordion

**Difficulty**: `easy`

## Goal
Build an accordion component that displays a list of expandable/collapsible items. Each item consists of a title (summary) and content details. The component should allow users to toggle the visibility of the content for each item independently.

## Concepts Used
- Semantic HTML

## Requirements

### Core Functionality
1.  Render a list of accordion items based on the provided configuration.
2.  Each item should display a title that can be clicked to toggle the visibility of its content.
3.  Allow independent control of each section (multiple sections can be open at once).

### Accessibility (A11y)
1.  Ensure native accessibility and keyboard support.
2.  Ensure content is hidden/shown appropriately for screen readers.

## API Design

The component should accept the following props:

-   `items`: `TAccordionItem[]` - An array of items to render.

**TAccordionItem Structure:**
-   `id`: `string` - Unique identifier for the item.
-   `title`: `string` - The text to display in the summary/header.
-   `content`: `string` - The text content to display when expanded.
