# useFileUpload Hook

**Difficulty**: 🔴 Hard · **Time**: 30–40 min

## What You'll Learn

- Custom React hooks for complex async logic
- `XMLHttpRequest` upload API with progress events
- Pause/resume file uploads using byte offsets and `File.slice()`
- Speed calculation and ETA estimation
- Ref-based mutable state (`useRef`) vs render state (`useState`)

## Goal

Build a custom hook `useFileUpload()` that manages the full lifecycle of a chunked file upload over `XMLHttpRequest`. It returns a `[state, controls]` tuple — similar to `useState` but for uploads.

```
                    useFileUpload()
                    ┌──────────────────────────────┐
                    │  Returns: [state, controls]   │
                    │                               │
  state:            │  status: 'uploading'          │
                    │  progress: 45.2               │
                    │  speed: 512 (KB/s)            │
                    │  bytes: 4620288               │
                    │  remainingTimeMs: 8500        │
                    │  error: null                  │
                    │                               │
  controls:         │  start(file, from?)           │
                    │  pause()                      │
                    │  resume(file)                 │
                    │  cancel()                     │
                    └──────────────────────────────┘
```

## Requirements

### State Machine

```
         start()          pause()
  idle ──────────► uploading ──────► paused
   ▲                  │    │           │
   │                  │    │  resume() │
   │    cancel()      │    ◄───────────┘
   ◄──────────────────┘
   │                  │
   │                  ▼ (success)
   │              completed
   │                  │
   │                  ▼ (failure)
   │                error
   ◄──────────────────┘
        cancel()
```

### Upload State

```ts
type TUploadStatus = 'idle' | 'uploading' | 'paused' | 'completed' | 'cancelled' | 'error'

type TUploadState = {
  status: TUploadStatus
  progress: number          // 0–100
  speed: number             // KB/s
  bytes: number             // bytes uploaded so far
  remainingTimeMs: number | null
  error: string | null
}
```

### Upload Controls

```ts
type TUploadControls = {
  start: (file: File, from?: number) => void  // begin upload (optionally from byte offset)
  pause: () => void                            // abort XHR, keep state
  resume: (file: File) => void                 // restart from last known offset
  cancel: () => void                           // abort XHR, reset to idle
}
```

## Walkthrough

### Step 1 — State and refs

```ts
const [state, setState] = useState<TUploadState>(DEFAULT_STATE)
const xhrRef = useRef<XMLHttpRequest | null>(null)     // active request
const metricsRef = useRef({ lastLoaded: 0, lastTime: 0 }) // for speed calc
const offsetRef = useRef(0)                              // resume offset
```

> **Why refs?** `xhrRef` and `offsetRef` are mutable values that don't trigger re-renders. They're accessed in event callbacks where stale closures would be a problem with `useState`.

### Step 2 — `start(file, from)`

1. Abort any existing XHR (`cleanup()`)
2. Set offset and reset metrics
3. Create a new `XMLHttpRequest`
4. Attach `upload.onprogress`, `onload`, `onerror` handlers
5. `xhr.open('POST', url)` and `xhr.send(file.slice(from))`

### Step 3 — Progress tracking with speed throttling

In `xhr.upload.onprogress`:
- Calculate `totalLoaded = from + e.loaded`
- Update speed every **500ms** (not every event) to avoid UI jitter:

```ts
if (timeDiffMs >= 500) {
  speed = (totalLoaded - lastLoaded) / 1024 / (timeDiffMs / 1000)  // KB/s
  metricsRef.current = { lastLoaded: totalLoaded, lastTime: now }
}
```

- Calculate ETA: `remainingTimeMs = (remainingKB / speed) * 1000`

### Step 4 — Pause and resume

**Pause**: Abort the XHR, set status to `'paused'`. The `offsetRef` retains the last known byte position.

**Resume**: Call `start(file, offsetRef.current)` — this slices the file from the last offset and sends the remainder.

```
File: [████████████████████████████████]
                    ▲
              offsetRef.current
              
Resume sends: file.slice(offsetRef.current)
              [░░░░░░░░░░░░░░░░████████]
                                ^^^^^^^^ remaining bytes
```

### Step 5 — Cancel

Abort the XHR, reset `offsetRef` to 0, and set state back to `DEFAULT_STATE`.

<details>
<summary>💡 Hint — Why XMLHttpRequest instead of fetch?</summary>

`fetch()` doesn't support upload progress events. `XMLHttpRequest` provides `xhr.upload.onprogress` which gives you `loaded` and `total` bytes — essential for a progress bar. This is one of the few cases where XHR is still preferred over fetch.
</details>

<details>
<summary>💡 Hint — useCallback for stable references</summary>

Wrap `start`, `pause`, `resume`, `cancel` in `useCallback` so they have stable references. This prevents unnecessary re-renders in consuming components and ensures the controls object (wrapped in `useMemo`) doesn't change on every render.
</details>

## Edge Cases

| Scenario | Expected |
|---|---|
| Upload completes | status → 'completed', progress = 100 |
| Network error | status → 'error', error message set |
| Pause then resume | Continues from last byte offset |
| Cancel during upload | XHR aborted, state reset to idle |
| File size = 0 | progress = 0, completes immediately |
| Start new upload while one is active | Previous XHR aborted first |

## Verification

1. Select file → upload starts, progress updates in real-time.
2. Click Pause → upload stops, status = 'paused'.
3. Click Resume → upload continues from where it left off.
4. Click Cancel → state resets to idle.
5. Upload completes → status = 'completed', progress = 100%.
6. Speed and ETA display reasonable values during upload.
