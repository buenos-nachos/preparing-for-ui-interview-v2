import React, { useMemo } from "react";
import { parseRichText, RICH_TEXT_RULES } from "./markdown-parser";




/**
 * Props for the Markdown component.
 */
interface MarkdownProps {
    /** The raw markdown text to parse and render */
    text: string;
}

/**
 * A React component that parses and renders Markdown text as HTML elements.
 * 
 * This component takes raw markdown text and converts it to React elements using
 * a two-step process:
 * 1. Parse markdown to HTML string using regex-based rules
 * 2. Convert HTML string to XML DOM, then traverse and convert to React elements
 * 
 * @param props - The component props
 * @param props.text - The raw markdown string to render
 * @returns React elements representing the parsed markdown, or error message on failure
 * 
 * @example
 * ```tsx
 * <Markdown text="# Hello\n\nThis is **bold** text." />
 * ```
 * 
 * @remarks
 * Supported markdown features:
 * - Headers (h1, h2)
 * - Bold (**text**), Italic (*text*), Strikethrough (~~text~~)
 * - Unordered lists (- item) and Ordered lists (1. item)
 * - Links ([text](url))
 * - Images (![alt](src))
 * - Tables (| col1 | col2 |)
 */
export const Markdown = ({ text }: MarkdownProps) => {
    const components = useMemo(() => {
        if (typeof text !== 'string') {
            return;
        }
        const xmlParser = new DOMParser();
        const rawText = cleanMarkdownFromHTML(text);
        const rawXML = parseRichText(rawText, RICH_TEXT_RULES);
        try {
            const xml = xmlParser.parseFromString(`<article>${rawXML}</article>`, 'application/xml');
            return traverseXMLTree(xml)
        } catch {
            return <p>Markdown parsing failed</p>
        }
    }, [text])
    return components;
};


/**
 * Sanitizes markdown text by stripping any existing HTML tags.
 * 
 * This function attempts to parse the input as XML to extract only the text content,
 * effectively removing any HTML tags that might be embedded in the markdown.
 * This prevents XSS attacks and ensures clean parsing.
 * 
 * @param text - The raw markdown text that may contain HTML
 * @returns Clean text with HTML tags removed, or original text if parsing fails
 * 
 * @example
 * ```ts
 * cleanMarkdownFromHTML('<script>alert("xss")</script>Hello')
 * // Returns: 'Hello' (script tags stripped)
 * 
 * cleanMarkdownFromHTML('Normal **markdown** text')
 * // Returns: 'Normal **markdown** text' (unchanged)
 * ```
 */
function cleanMarkdownFromHTML(text: string) {
    const xmlParser = new DOMParser();
    try {
        const xml = xmlParser.parseFromString(`<section>${escapeHTMLAmpersand(text)}</section>`, 'application/xml')
        const parseError = xml.querySelector('parsererror');
        return parseError != null ? text : escapeHTMLAmpersand(xml.firstElementChild?.textContent);
    } catch {
        return text;
    }
}

/**
 * Escapes ampersand characters for safe XML parsing.
 * 
 * Replaces all `&` characters with `&amp;` to prevent XML parsing errors.
 * Unescaped ampersands in XML are invalid and cause parse failures.
 * 
 * @param text - The text to escape (optional)
 * @returns The text with ampersands escaped, or empty string if text is undefined
 * 
 * @example
 * ```ts
 * escapeHTMLAmpersand('Tom & Jerry')  // Returns: 'Tom &amp; Jerry'
 * escapeHTMLAmpersand(undefined)       // Returns: ''
 * ```
 */
function escapeHTMLAmpersand(text?: string): string {
    return text?.replace(/&/g, '&amp;') ?? '';
}

/**
 * Enumeration of all XML node types that can appear in parsed markdown.
 * 
 * These values correspond to the `nodeName` property of DOM nodes,
 * allowing type-safe switching when traversing the XML tree.
 * Each enum value maps to its corresponding HTML tag name.
 * 
 * @remarks
 * The parser converts markdown to HTML tags, which are then parsed as XML.
 * This enum helps identify each node type during tree traversal.
 */
enum TRichTextXMLNodes {
    /** Text node - contains raw text content between tags */
    Text = '#text',
    /** Root article wrapper - contains all parsed content */
    Article = 'article',
    /** Bold text - rendered as <b> */
    Bold = 'b',
    /** Italic text - rendered as <i> */
    Italic = 'i',
    /** Strikethrough text - rendered as <s> */
    Strikethrough = 's',
    /** Level 1 header - rendered as <h1> */
    Header1 = 'h1',
    /** Level 2 header - rendered as <h2> */
    Header2 = 'h2',
    /** Level 3 header - rendered as <h3> */
    Header3 = 'h3',
    /** Level 4 header - rendered as <h4> */
    Header4 = 'h4',
    /** Level 5 header - rendered as <h5> */
    Header5 = 'h5',
    /** Unordered list container - rendered as <ul> */
    UnorderedList = 'ul',
    /** Ordered list container - rendered as <ol> */
    OrderedList = 'ol',
    /** List item - rendered as <li> */
    ListItem = 'li',
    /** Image element - rendered as <img> */
    Image = 'img',
    /** Table container - rendered as <table> */
    Table = 'table',
    /** Table body - rendered as <tbody> */
    TableBody = 'tbody',
    /** Table head - rendered as <thead> */
    TableHead = 'thead',
    /** Table header cell - rendered as <th> */
    TableHeader = 'th',
    /** Table row - rendered as <tr> */
    TableRow = 'tr',
    /** Table data cell - rendered as <td> */
    TableCell = 'td',
    /** Anchor/link element - rendered as <a> */
    Anchor = 'a',
    /** Paragraph - rendered as <p> */
    Paragraph = 'p',
    /** Inline code - rendered as <code> */
    Code = 'code',
    /** Preformatted text - rendered as <pre> */
    Pre = 'pre',

}

/**
 * Recursively traverses an XML tree and converts nodes to React elements.
 * @param node - The current node to process
 * @returns React element(s) representing the node and its children
 */
function traverseXMLTree(node: Node | null): React.ReactNode {
    if (node == null) return null;

    const type = node.nodeName as TRichTextXMLNodes;

    // Helper to process all child nodes
    const processChildren = (n: Node): React.ReactNode[] => {
        return Array.from(n.childNodes).map((child, index) => (
            <React.Fragment key={index}>{traverseXMLTree(child)}</React.Fragment>
        ));
    };

    switch (type) {
        case TRichTextXMLNodes.Text:
            return node.textContent;
        case TRichTextXMLNodes.Article:
            return <article>{processChildren(node)}</article>;
        case TRichTextXMLNodes.Bold:
            return <b>{processChildren(node)}</b>;
        case TRichTextXMLNodes.Italic:
            return <i>{processChildren(node)}</i>;
        case TRichTextXMLNodes.Strikethrough:
            return <s>{processChildren(node)}</s>;
        case TRichTextXMLNodes.Header1:
            return <h1>{processChildren(node)}</h1>;
        case TRichTextXMLNodes.Header2:
            return <h2>{processChildren(node)}</h2>;
        case TRichTextXMLNodes.Header3:
            return <h3>{processChildren(node)}</h3>;
        case TRichTextXMLNodes.Header4:
            return <h4>{processChildren(node)}</h4>;
        case TRichTextXMLNodes.Header5:
            return <h5>{processChildren(node)}</h5>;
        case TRichTextXMLNodes.UnorderedList:
            return <ul>{processChildren(node)}</ul>;
        case TRichTextXMLNodes.OrderedList:
            return <ol>{processChildren(node)}</ol>;
        case TRichTextXMLNodes.ListItem:
            return <li>{processChildren(node)}</li>;
        case TRichTextXMLNodes.Image:
            return <img src={(node as Element).getAttribute('src') ?? ''} alt={(node as Element).getAttribute('alt') ?? ''} />;
        case TRichTextXMLNodes.Table:
            return <table>{processChildren(node)}</table>;
        case TRichTextXMLNodes.TableBody:
            return <tbody>{processChildren(node)}</tbody>;
        case TRichTextXMLNodes.TableHead:
            return <thead>{processChildren(node)}</thead>;
        case TRichTextXMLNodes.TableHeader:
            return <th>{processChildren(node)}</th>;
        case TRichTextXMLNodes.TableRow:
            return <tr>{processChildren(node)}</tr>;
        case TRichTextXMLNodes.TableCell:
            return <td>{processChildren(node)}</td>;
        case TRichTextXMLNodes.Anchor:
            return <a href={(node as Element).getAttribute('href') ?? ''}>{processChildren(node)}</a>;
        case TRichTextXMLNodes.Paragraph:
            return <p>{processChildren(node)}</p>;
        case TRichTextXMLNodes.Pre:
            return <pre>{processChildren(node)}</pre>;
        case TRichTextXMLNodes.Code:
            return <code className={(node as Element).getAttribute('class') ?? undefined}>{processChildren(node)}</code>;
        default:
            // For unknown nodes (like Document), just process children
            if (node.childNodes.length > 0) {
                return <>{processChildren(node)}</>;
            }
            return node.textContent;
    }
}



