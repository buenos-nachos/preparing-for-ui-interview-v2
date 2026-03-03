# Prepare for UI Interview V2

This is a **Frontend Masters - Prepare for UI Interview V2** supporting repo. Here you will find problems that we solve together on the course along with additional materials and reference solutions for DOM API Based / React based challenges.

## 🎓 Course Structure

The course is divided into multiple sections, and with each section, we will gradually increase the difficulty.

### 1. Classic JavaScript Problems

This section serves as a warm-up. We will start with short (5–10 minute) problems that provide an overview of common JavaScript utilities and patterns frequently tested in interviews.

### 2. Practical UI Problems

Here, we will get our hands dirty and implement real UI patterns, components, and parts of applications.
We will actively use **HTML**, **CSS**, **TypeScript**, and **React**.

Each problem will have:

- A vanilla (framework-free) solution
- A React-based solution

During the workshop, we will intentionally switch between vanilla JavaScript and React to strengthen both skill sets.
I strongly advise you to **disable** all AI assistance and practice the problems on your own. The goal of this section is to acquire all the necessary skills to solve UI component problems using both React and Vanilla approaches.

### 3. TypeScript Problems

Finally, we will cover essential TypeScript type-level programming—the kind often asked in senior and staff-level frontend interviews. This is often called "type programming". You can even code the Doom game in TypeScript types! But, luckily for us, we won't get that deep :)

## 🧠 Problem Difficulty

The problems in this workshop are intentionally **slightly** harder than real interview questions.
The idea is simple: **If you train on harder problems, real interviews will feel calmer and more manageable.**

Problems are grouped into the following difficulty levels:

### 🧘 Warm-up

- Very basic problems that you should solve quickly.
- **Expected time**: 2–4 minutes.

### 🟢 Easy

- Small 5–10 minute problems.
- Some companies may give 3–4 easy problems in a 45-minute screening interview.

### 🟡 Medium

- 15–20 minute problems.
- The majority of frontend interview questions fall into this category.

### 🔴 Hard

- 45+ minute problems that require practice and familiarity with specific browser APIs.
- During the workshop, we will aim to solve them in 20–25 minutes to save time, but in real interviews, you would typically spend 45–60 minutes.
- **Examples**:
  - Observer APIs
  - Drag & Drop
  - Event handling

### 🚀 Extreme

- 1–2 hour end-to-end problems.
- These usually involve building a minimal version of a real product feature from scratch.
- You may be provided with a mock server or API, and the focus shifts heavily toward architecture and structure.
- **Examples**:
  - Figma-like canvas
  - Google Sheets–style grid
  - To-do application
  - Chat application (e.g., ChatGPT-like UI)

## 🚀 Running Instructions

This project uses **[Bun](https://bun.sh/)** as a runtime and package manager.

### Prerequisites

- Install Bun: [https://bun.sh/docs/installation](https://bun.sh/docs/installation)

### Commands

**Install Dependencies:**

```bash
bun install
```

**Run Development Server:**

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in console) to see the app.

**Run Tests:**

```bash
bun test
```

**Type Check:**

```bash
npx tsc --noEmit
```

## 📚 Table of Contents

You can find the list of problems and solutions here. During the workshop, we'll solve each problem
either in React or Vanilla TS, but this repo contains both solutions for reference :)

### 1. Vanilla JS / DOM API

Low-level DOM manipulation tasks and vanilla JavaScript implementations of common UI patterns.

| #   | Problem         | Difficulty | Concepts                                                | Links                                            |
| --- | --------------- | ---------- | ------------------------------------------------------- | ------------------------------------------------ |
| 1   | **Detect Type** | 🟢 Easy    | `typeof`, `instanceof`, `Object.prototype.toString`     | [Solution](./src/problems/vanila/01-detect-type) |
| 2   | **Debounce**    | 🟢 Easy    | Closures, `setTimeout`, Higher-order Functions          | [Solution](./src/problems/vanila/02-debounce)    |
| 3   | **Throttle**    | 🟢 Easy    | Closures, Time-based Logic, Rate Limiting               | [Solution](./src/problems/vanila/03-throttle)    |
| 4   | **ES5 Extends** | 🟡 Medium  | Prototypal Inheritance, `prototype` chain, `call/apply` | [Solution](./src/problems/vanila/04-es5-extends) |
| 5   | **Deep Equals** | 🟡 Medium  | Recursion, Type Checking, Object Traversal              | [Solution](./src/problems/vanila/05-deep-equals) |
| 6   | **Deep Clone**  | 🟡 Medium  | Recursion, Circular References, `WeakMap`               | [Solution](./src/problems/vanila/06-deep-clone)  |
| 7   | **Stringify**   | 🟡 Medium  | Recursion, JSON Spec, Edge Cases                        | [Solution](./src/problems/vanila/07-stringify)   |
| 8   | **Promise**     | 🔴 Hard    | Asynchrony, Microtasks, State Machine                   | [Solution](./src/problems/vanila/08-promise)     |
| 9   | **Tree Select** | 🔴 Hard    | DOM Traversal, Event Bubbling / Delegation              | [Solution](./src/problems/vanila/09-tree-select) |

### 2. React Components

Reusable UI components and widgets implemented in React.

| #    | Component                | Difficulty | Concepts                                        | Links                                                                 |
| ---- | ------------------------ | ---------- | ----------------------------------------------- | --------------------------------------------------------------------- |
| 1    | **Accordion**            | 🟢 Easy    | State Management, Compound Components           | [Solution](./src/problems/components/01-accordion)                    |
| 2    | **Star Rating**          | 🟢 Easy    | State, Hover Effects, Array Rendering           | [Solution](./src/problems/components/02-star-rating)                  |
| 3    | **Tabs**                 | 🟢 Easy    | State, Composition, Accessibility               | [Solution](./src/problems/components/03-tabs)                         |
| 4    | **Tooltip**              | 🟢 Easy    | Portals, Refs, Coordinate Math                  | [Solution](./src/problems/components/04-tooltip)                      |
| 5    | **Dialog**               | 🟢 Easy    | HTMLDialogElement, Ref, Portals                 | [Solution](<./src/problems/components/05-dialog(todo)>)               |
| 6    | **Table**                | 🟡 Medium  | Array Manipulation, Sorting/Filtering           | [Solution](./src/problems/components/06-table)                        |
| 7    | **Reddit Thread**        | 🟡 Medium  | Recursion, Data Normalization                   | [Solution](./src/problems/components/07-reddit-thread)                |
| 8    | **Gallery**              | 🟡 Medium  | Image Loading, Modal/Overlay                    | [Solution](./src/problems/components/08-gallery)                      |
| 9    | **Nested Checkboxes**    | 🔴 Hard    | Recursion, Tree Data, Derived State             | [Solution](./src/problems/components/09-nested-checkboxes)            |
| 10   | **Toast**                | 🔴 Hard    | React Context, Timers, Portals                  | [Solution](./src/problems/components/10-toast)                        |
| 11   | **Calculator**           | 🔴 Hard    | String Parsing, State Machine                   | [Solution](./src/problems/components/11-calculator)                   |
| 12   | **Square Game**          | 🔴 Hard    | Grid Rendering, Game State                      | [Solution](./src/problems/components/12-square-game)                  |
| 13   | **Typeahead**            | 🔴 Hard    | Debouncing, Async Data, Keyboard Nav            | [Solution](./src/problems/components/13-typeahead)                    |
| 14   | **Heatmap**              | 🔴 Hard    | Color Scales, Grid Layout, Tooltips             | [Solution](./src/problems/components/14-heatmap)                      |
| 15   | **Progress Bar**         | 🔴 Hard    | CSS Transitions, Props Control                  | [Solution](./src/problems/components/15-progress-bar)                 |
| 16   | **Upload Component**     | 🔴 Hard    | Drag & Drop API, File API                       | [Solution](./src/problems/components/16-upload-component)             |
| 17   | **Portfolio Visualizer** | 🚀 Extreme | Data Visualization, Charts                      | [Solution](<./src/problems/components/17-portfolio-visualizer(todo)>) |
| 18   | **Markdown Editor**      | 🚀 Extreme | Text Processing, Regex, Syntax Highlighting     | [Solution](./src/problems/components/18-markdown)                     |
| 19   | **GPT Chat Interface**   | 🚀 Extreme | Streaming Responses, Auto-scroll                | [Solution](./src/problems/components/19-gpt-chat)                     |
| 20   | **Infinite Canvas**      | 🚀 Extreme | Canvas API, 2D Transform Matrix, Virtualization | [Solution](./src/problems/components/20-infinite-canvas)              |
| 19.1 | **GS: Basic**            | 🟡 Medium  | Map, Setup, Getters                             | [Solution](./src/problems/components/19.1-google-sheet-basic)         |
| 19.2 | **GS: Compile**          | 🟡 Medium  | Tokenizer, RPN, AST Compile                     | [Solution](./src/problems/components/19.2-google-sheet-compile)       |
| 19.3 | **GS: Topo Sort**        | 🔴 Hard    | Topological Sort, Cycle Detection               | [Solution](./src/problems/components/19.3-google-sheet-topo)          |
| 19.4 | **GS: Eval**             | 🔴 Hard    | RPN Evaluation, basic formula                   | [Solution](./src/problems/components/19.4-google-sheet-eval)          |
| 19.5 | **GS: Recompute**        | 🚀 Extreme | Graph Dependency, Full Engine                   | [Solution](./src/problems/components/19.5-google-sheet-recompute)     |
| 19.6 | **GS: UX**               | 🚀 Extreme | Virtual Grid, Cell Editing, Formatting          | [Solution](./src/problems/components/19.6-google-sheet-ux)            |

### 3. TypeScript Challenges

A comprehensive collection of 9 levels of TypeScript type challenges.

| Level | Topic                         | Key Concepts                               | Link                                                                           |
| ----- | ----------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| 1     | **Basics**                    | `keyof`, `typeof`, Indexed Access          | [Start Level](./src/problems/typescript/01-basics/index.md)                    |
| 2     | **Mapped Types**              | Mapping, Modifiers `+`/`-`, Remapping `as` | [Start Level](./src/problems/typescript/02-mapped-types/index.md)              |
| 3     | **Conditional Types**         | `T extends U ? X : Y`, Distributivity      | [Start Level](./src/problems/typescript/03-conditional-types/index.md)         |
| 4     | **Infer**                     | `infer` keyword, Pattern Matching          | [Start Level](./src/problems/typescript/04-infer/index.md)                     |
| 5     | **Template Literals**         | String manipulation, Intrinsic types       | [Start Level](./src/problems/typescript/05-template-literals/index.md)         |
| 6     | **Recursive Types**           | Recursion, Accumulators, Depth limits      | [Start Level](./src/problems/typescript/06-recursive-types/index.md)           |
| 7     | **Distributive Conditionals** | Union distribution, Naked generics         | [Start Level](./src/problems/typescript/07-distributive-conditionals/index.md) |
| 8     | **Advanced Patterns**         | Filtering, OmitByValue, Sub-array chunks   | [Start Level](./src/problems/typescript/08-advanced-patterns/index.md)         |
| 9     | **Expert Techniques**         | Contravariance, `any` hacks, Matrix types  | [Start Level](./src/problems/typescript/09-expert-techniques/index.md)         |

---

_Found an issue or want to contribute? Feel free to open a PR!_
