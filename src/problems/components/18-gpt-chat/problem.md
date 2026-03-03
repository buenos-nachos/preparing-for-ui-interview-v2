# GPT Chat Interface

**Difficulty**: 🚀 Extreme · **Time**: 45–60 min

## What You'll Learn

- Streaming HTTP responses with `ReadableStream` / `getReader()`
- Typewriter effect using `requestAnimationFrame`
- Chunk buffering pattern (queue chunks, type them one at a time)
- `AbortController` for cancelling in-flight requests
- Auto-scroll to bottom during streaming content

## Goal

Build a ChatGPT-like interface that streams a Markdown response from the server, renders it character-by-character with a typewriter effect, and displays the result as formatted HTML using the Markdown parser (from problem 17).

```
┌──────────────────────────────────────┐
│                                      │
│  # Hello World                       │  ← streamed + typed content
│                                      │
│  This is a **streaming** response    │     rendered as Markdown → HTML
│  from the server. Each chunk arrives │
│  over time and is typed out...       │
│  █                                   │  ← typing cursor
│                                      │
├──────────────────────────────────────┤
│  [textarea_______________] [ Send ]  │  ← input area
└──────────────────────────────────────┘

During streaming:
│  [textarea_______________] [ Stop ]  │  ← abort button
```

## Requirements

### Core Functionality

1. **Send button**: Triggers a streaming fetch to `/api/stream-markdown`.
2. **Streaming**: Read the response body chunk-by-chunk using `ReadableStream.getReader()`.
3. **Typewriter effect**: Don't dump each chunk instantly — type it out character-by-character using `requestAnimationFrame`.
4. **Markdown rendering**: Pass the accumulated text through the Markdown parser and render as HTML.
5. **Stop button**: Abort the stream mid-response using `AbortController`.
6. **Auto-scroll**: Scroll the content area to the bottom as new content appears.

### Data Flow

```
Server (streaming)          Client
─────────────────          ──────────────────────────────────
  chunk "# Hello"    ──►   chunks queue: ["# Hello"]
  chunk " World\n"   ──►   chunks queue: [" World\n"]
  chunk "This is"    ──►   chunks queue: ["This is"]
                            │
                            ▼
                     Typewriter loop:
                       dequeue chunk → type char by char
                       setContent(prev + chars)
                       requestAnimationFrame(next)
                            │
                            ▼
                     Markdown parser:
                       parseRichText(content) → HTML
                            │
                            ▼
                     Render HTML in content area
                     Auto-scroll to bottom
```

### useMarkdownStream Hook

```ts
type StreamCallback = (chunk: string) => void

type StreamOptions = {
  onComplete?: () => void
  onError?: (error: Error) => void
  delay?: number              // server-side delay between chunks (ms)
}

function useMarkdownStream(options?: StreamOptions): {
  stream: (onChunk: StreamCallback) => void
  abort: () => void
  inProgress: boolean
}
```

**Key implementation details:**
- Uses `fetch()` with `AbortController` signal
- Reads chunks via `response.body.getReader()` + `TextDecoder`
- Calls `onChunk(text)` for each decoded chunk
- Sets `inProgress` state for UI toggling (Send ↔ Stop)

## Walkthrough

### Step 1 — Build the streaming hook

```ts
const stream = (onChunk) => {
  const controller = new AbortController()
  controllerRef.current = controller
  setInProgress(true)

  const response = await fetch(url, { signal: controller.signal })
  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    onChunk(decoder.decode(value, { stream: true }))
  }
}
```

### Step 2 — Buffer chunks in state

As chunks arrive, push them into a queue:

```ts
stream((chunk) => {
  setChunks(prev => [...prev, chunk])
})
```

### Step 3 — Typewriter effect with requestAnimationFrame

When a chunk is available and the typewriter isn't busy, dequeue it and type character-by-character:

```ts
function recursiveType(chunk) {
  if (chunk.length === 0) { setIsTyping(false); return }
  const chars = chunk.slice(0, 2)  // type 2 chars per frame
  const rest = chunk.slice(2)
  setContent(prev => prev + chars)
  if (rest.length > 0) {
    requestAnimationFrame(() => recursiveType(rest))
  } else {
    setIsTyping(false)
  }
}
```

The `useEffect` coordinates the queue and typewriter:

```ts
useEffect(() => {
  if (!isTyping && chunks.length > 0) {
    setIsTyping(true)
    const [nextChunk, ...rest] = chunks
    setChunks(rest)
    type(nextChunk)
  }
}, [chunks, isTyping])
```

### Step 4 — Render with Markdown

Pass the accumulated `content` string to the `<Markdown>` component (from problem 17):

```tsx
<Markdown text={content} />
```

### Step 5 — Auto-scroll

After each content update, scroll the container to the bottom:

```ts
contentRef.current?.scrollTo({
  top: contentRef.current.scrollHeight,
  behavior: 'smooth'
})
```

<details>
<summary>💡 Hint — Why buffer chunks instead of typing directly?</summary>

Chunks arrive from the network at unpredictable intervals. The typewriter effect runs at a fixed speed (per animation frame). If a new chunk arrives while the previous one is still being typed, you'd lose it. The buffer (queue) ensures every chunk gets typed in order.
</details>

<details>
<summary>💡 Hint — Why requestAnimationFrame instead of setTimeout?</summary>

`requestAnimationFrame` syncs with the browser's paint cycle (typically 60fps), giving the smoothest possible typing animation. `setTimeout` can drift and cause janky rendering. It also automatically pauses when the tab is hidden, saving resources.
</details>

<details>
<summary>💡 Hint — AbortController cleanup</summary>

Always abort the previous stream before starting a new one (`controllerRef.current?.abort()`). Also handle `AbortError` gracefully — it's expected when the user clicks "Stop", not a real error.
</details>

## Edge Cases

| Scenario | Expected |
|---|---|
| Click Stop mid-stream | Stream aborts, typed content preserved |
| Click Send while streaming | Previous stream aborted, new one starts |
| Server error | `onError` callback fires, `inProgress` resets |
| Empty response | No content rendered |
| Very fast chunks | Buffer handles backpressure, typewriter catches up |
| Very large response | Auto-scroll keeps content visible |

## Verification

1. Click Send → content streams in with typewriter effect.
2. Markdown formatting renders correctly (headers, bold, lists, etc.).
3. Click Stop → streaming stops, content so far is preserved.
4. Content area auto-scrolls as new text appears.
5. Send/Stop button toggles based on `inProgress` state.
