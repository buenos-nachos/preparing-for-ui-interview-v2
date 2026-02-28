# Stringify

## Problem

Implement a `stringify` function that converts any JavaScript value to a readable string representation, with support for circular reference detection.

## Requirements

- **Primitives**: Convert to string representation
  - `null` → `"null"`
  - Numbers → `"42"`, `"3.14"`
  - Booleans → `"true"`, `"false"`
  - Strings → `"\"hello\""` (with quotes)
  - BigInt → `"123"`
- **Arrays/Sets**: Format as `[value1,value2,...]`
- **Objects/Maps**: Format as `{ key1: value1, key2: value2 }`
- **Date**: Use `.toLocaleString()`
- **RegExp**: Use `.toString()`
- **Circular references**: Return `"[Circular]"` marker

## Signature

```typescript
function stringify<T>(value: T): string
```

## Examples

```typescript
// Primitives
stringify(null) // "null"
stringify(42) // "42"
stringify(true) // "true"
stringify('hello') // "\"hello\""

// Arrays
stringify([1, 2, 3]) // "[1,2,3]"

// Objects
stringify({ a: 1 }) // "{ a: 1 }"
stringify({ name: 'John' }) // "{ name: \"John\" }"

// Circular reference
const obj = { a: 1 }
obj.self = obj
stringify(obj) // "{ a: 1, self: [Circular] }"
```

## Hints

1. Use type detection to determine how to format each value
2. Use a `WeakSet` to track seen objects for circular reference detection
3. Check if value is in `seen` before recursing, add to `seen` before processing
4. Pass `seen` to all recursive calls

## Run Tests

```bash
bun test src/problems/vanila/07-stringify/test/stringify.test.ts
```
