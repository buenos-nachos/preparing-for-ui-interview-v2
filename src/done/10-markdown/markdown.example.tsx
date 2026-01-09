import { Markdown } from "./markdown.react";

const EXAMPLE_MARKDOWN = `# Welcome to Markdown Parser

## Text Formatting

This is a paragraph with **bold text**, *italic text*, and ~~strikethrough text~~.

You can also combine them: ***bold and italic*** or **~~bold strikethrough~~**.

## Lists

### Unordered List
- First item
- Second item
- Third item

### Ordered List
1. Step one
2. Step two
3. Step three

## Links

Check out [Google](https://google.com) or [GitHub](https://github.com).

## Tables

| Name | Age | City |
|------|-----|------|
| Alice | 25 | NYC |
| Bob | 30 | LA |
| Charlie | 35 | Chicago |
`;

/**
 * Example component demonstrating the Markdown parser capabilities.
 * 
 * Renders a preview panel showing various markdown features including:
 * - Headers (h1, h2)
 * - Text formatting (bold, italic, strikethrough, combinations)
 * - Unordered and ordered lists
 * - Hyperlinks
 * - Tables with headers and data rows
 * 
 * @returns A styled container with the rendered markdown example
 * 
 * @example
 * ```tsx
 * // In your app:
 * <MarkdownExample />
 * ```
 */
export const MarkdownExample = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px' }}>
            <h3 style={{ marginBottom: '16px', color: '#666' }}>Markdown Preview:</h3>
            <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fafafa'
            }}>
                <Markdown text={EXAMPLE_MARKDOWN} />
            </div>
        </div>
    );
};
