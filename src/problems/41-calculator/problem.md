# Calculator

**Difficulty**: 🔴 Hard · **Time**: 25–30 min

## What You'll Learn

- State machine design for expression building
- String parsing and evaluation
- Button map pattern (data-driven UI)
- Edge case handling (division by zero, operator chaining)

## Goal

Build a calculator that displays an expression string and evaluates it on `=`. Support digits, basic operations (+, −, ×, ÷, %), negation, and clear.

```
┌─────────────────────┐
│              5+3*2   │  ← expression display
├─────┬─────┬────┬────┤
│ AC  │ +/- │  % │  ÷ │
├─────┼─────┼────┼────┤
│  7  │  8  │  9 │  × │
├─────┼─────┼────┼────┤
│  4  │  5  │  6 │  − │
├─────┼─────┼────┼────┤
│  1  │  2  │  3 │  + │
├─────┴─────┼────┼────┤
│     0     │  . │  = │
└───────────┴────┴────┘
```

## Requirements

### Core Functionality

1. **Digit input**: Append digits to the expression. Replace initial `0` (avoid `05`).
2. **Operations**: Append `+`, `-`, `*`, `/`, `%` to the expression.
3. **Operator replacement**: If the last character is already an operator, replace it (prevent `5+-`).
4. **Evaluate (`=`)**: Compute the result and display it.
5. **Clear (AC)**: Reset to `0`.
6. **Negate (+/-)**: Wrap expression in `-(…)` or unwrap if already negated.
7. **Decimal point**: Append `.` like a digit.

### Button Map Pattern

Define all buttons as a `Map<label, { label, action }>` where `action` is a function `(state, label) => newState`. This drives both rendering and logic:

```
BUTTONS Map:
  "AC"  → { action: clear }        // returns "0"
  "+/-" → { action: negate }       // wraps/unwraps -(…)
  "7"   → { action: applyNumber }  // appends digit
  "+"   → { action: applyOperation } // appends operator
  "="   → { action: calculate }    // evaluates expression
  ...
```

### Evaluation

Use `new Function('return ' + expression)()` to evaluate the expression string. Handle errors:

- Non-numeric characters → `"Invalid value"`
- `NaN` or `Infinity` (e.g., `1/0`) → `"Invalid value"`
- Syntax errors → `"Invalid value"`

## Walkthrough

### Step 1 — Define action functions

```ts
applyNumber(state, digit):
  state === "0" ? digit : state + digit

applyOperation(state, op):
  lastChar is operator ? replace it : append op

calculate(state):
  try { eval(state) } catch → "Invalid value"

clear(): "0"

negate(state):
  matches /-(…)/ ? unwrap : wrap in -(…)
```

### Step 2 — Create the button map

A `Map` of all 19 buttons. Iterate over it to render the grid. On click, look up the button's action and call it with the current state.

### Step 3 — Render with event delegation

Each button has `data-label={label}`. Attach a single click handler on the grid container:

```ts
const handleClick = ({ target }) => {
  const label = target.dataset.label
  const button = BUTTONS.get(label)
  if (button) setState((prev) => button.action(prev, label))
}
```

### Step 4 — Display

Show the current expression string in a display area. Format the result with `toFixed(5)` and strip trailing zeros.

### 💡 Hint — Why a Map for buttons?

The Map serves as both the **data model** (what buttons exist and what they do) and the **rendering source** (iterate to create the grid). This separates logic from presentation — the same map works for React and Vanilla implementations.



### 💡 Hint — Security of eval/new Function

In a real app, `eval` is dangerous. Here it's safe because we validate the input with a regex (`/[0-9.()+/%*-]/`) before evaluating. In production, you'd use a proper expression parser (like the one in the Google Sheets problem!).



## Edge Cases

| Scenario                 | Expected                                           |
| ------------------------ | -------------------------------------------------- |
| `1/0`                    | "Invalid value" (Infinity)                         |
| `0.1 + 0.2`              | `0.3` (use toFixed to avoid floating point issues) |
| Multiple operators `5+-` | Last operator wins: `5-`                           |
| Leading zero `05`        | Replaced: `5`                                      |
| Negate twice             | Returns to original: `5` → `-(5)` → `5`            |
| Empty expression + `=`   | Evaluates `0`                                      |

## Verification

1. Type `5 + 3 =` → displays `8`.
2. Type `1 / 0 =` → displays "Invalid value".
3. Press AC → resets to `0`.
4. Press `+/-` → expression wraps in `-(…)`.
5. Type `5 + - *` → only `*` remains as operator.
