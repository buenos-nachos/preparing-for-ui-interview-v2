# Frontend Masters: Preparing for the Interview - Master Doc

| **Stage** | **Target Date** | Status |
| --- | --- | --- |
| Content preparation | Feb 1 | In progress |
| Review | Feb 8 |  |
| Polishing | Feb 15 |  |
| Slides | Feb 28 |  |

# 1. Introduction

Hello everyone, and welcome to the **Frontend Interview Preparation Course**.

I have conducted many interviews throughout my career, and I consistently find **coding interviews** to be the most stressful part of the process. The reason is simple: under stress, our brains often struggle, making structured thinking significantly harder.

The goal of this course is to **practice solving real coding problems** in a calm, structured environment. This is **not an algorithms course**; instead, it is a **frontend-focused, hands-on workshop**.

To prepare effectively, we need to practice problems that are:

- Slightly **harder than typical interview questions**, and
- High-fidelity simulations of **what you will actually face** in frontend interviews.

By doing this, when you encounter similar problems in a real interview, you won't panic. You will recognize the pattern and know exactly how to approach it.

## Course Structure

The course is divided into multiple sections, and with each section, we will gradually **increase the difficulty**.

1. **Classic JavaScript Problems**
    
    This section serves as a warm-up. We will start with short (5–10 minute) problems that provide an overview of common JavaScript utilities and patterns frequently tested in interviews.
    
2. **Practical UI Problems**
    
    Here, we will get our hands dirty and implement real UI patterns, components, and parts of applications.
    
    We will actively use **HTML, CSS, TypeScript, and React**.
    
    Each problem will have:
    
    - A **vanilla (framework-free) solution**, and
    - A **React-based solution**.
    
    During the workshop, we will intentionally switch between **vanilla JavaScript and React** to strengthen both skill sets.
    
3. **TypeScript Problems**
    
    Finally, we will cover essential **TypeScript type-level programming**—the kind often asked in senior and staff-level frontend interviews.
    

## Problem Difficulty

The problems in this workshop are intentionally **slightly harder than real interview questions**.

The idea is simple:

If you train on harder problems, real interviews will feel calmer and more manageable.

Problems are grouped into the following difficulty levels:

1. **Warm-up**
    
    Very basic problems that you should solve quickly.
    
    Expected time: **2–4 minutes**.
    
2. **Easy**
    
    Small 5–10 minute problems.
    
    Some companies may give **3–4 easy problems in a 45-minute screening interview**.
    
3. **Medium**
    
    **15–20 minute** problems.
    
    The majority of frontend interview questions fall into this category.
    
4. **Hard**
    
    **45+ minute** problems that require practice and familiarity with specific browser APIs.
    
    During the workshop, we will aim to solve them in **20–25 minutes** to save time, but in real interviews, you would typically spend **45–60 minutes**.
    
    Examples:
    
    - Observer APIs
    - Drag & Drop
    - Event handling
5. **Extreme**
    
    **1–2 hour** end-to-end problems.
    
    These usually involve building a **minimal version of a real product feature from scratch**.
    
    You may be provided with a mock server or API, and the focus shifts heavily toward **architecture and structure**.
    
    Examples:
    
    - Figma-like canvas
    - Google Sheets–style grid
    - To-do application
    - Chat application (e.g., ChatGPT-like UI)

## Finding Solutions

All problem solutions are included in the course materials.

However, I strongly encourage you to **re-implement the solutions yourself after finishing the course**. That is where the real learning happens.

# 2. Key Concepts

## 2.1 Event Delegation
## 2.2 Semantic tags / Power of HTML

# 3. Vanilla Problems

In this section, we will solve some of the most practical **JavaScript / TypeScript** problems you are likely to encounter in frontend interviews.

# 4. Practical UI Problems

Practical UI problems usually involve implementing a small feature or component **end-to-end**.

They generally fall into three categories:

1. **Component implementation**
2. **Mini-app end-to-end implementation**
3. **Product feature implementation**

We will start this section with various component problems. The difficulty will increase with each problem. We will use the initial problems to understand the general approach to solving such tasks and cover the necessary requirements. 

## 4.1 Component Problems

First, we need to understand the general expectations when solving a component problem.

### **Inputs**

1. **Component Mock-up** (Figma design or simple schema)
2. **Expected component behavior** 
    1. Possible user interactions
    2. Component behavior and logic
3. **Technical details**
    1. Target devices
    2. Expected performance
    3. Limitations 

### Expectations

1. **Component Property Model** 
    1. Data that flows into the component
    2. Callback interface
    3. Exposed API 
    4. TypeScript typing / JSDoc
2. **Implementation**
    1. **Minimal necessity approach.** Do not code behaviors that are not covered by requirements. Leverage the Browser API instead of writing custom logic. 
    2. **Clean and readable code.** Your code should be easily readable, and variables should have reasonable naming conventions.
    3. **Architecture.** Think about scaling: if your component accepts a list of items, what happens if you pass 1,000 elements? Can we use common patterns to reduce the memory footprint?
    4. **Accessibility & Semantics.** Do you properly leverage semantic HTML? Will your component be accessible by screen readers? 
3. **Testing**
    1. Basic functionality test cases
    2. Corner cases
    3. Complexity estimations 

### Problem 0 - General approach to solving any component problem

When we build UI components, they generally follow a similar lifecycle: 

1. **init** - We initialize the component in memory.
2. **render** - The component is rendered in the DOM.
3. **side-effects** - User clicks, event listeners that can update data.
4. **destroy** - The component is removed from the DOM.

![image.png](attachment:8d5389bb-c988-4ebe-bf6b-bf7095b70e51:image.png)

It means that we can define a generic structure / interface for such components and use it everywhere: 

```tsx
/**
 * Configuration object for a Component instance.
 * 
 * @typeParam T - Custom properties to extend the base configuration.
 * 
 * @property root - The parent HTMLElement where the component will be mounted.
 * @property className - CSS class name(s) to apply to the component's root element.
 * @property listeners - Type-safe DOM event listeners mapped to their corresponding event types.
 */
type TComponentConfig<T extends object> = T & {
    /** The parent HTMLElement where the component will be mounted */
    root: HTMLElement;
    /** CSS class name(s) to apply to the component's root element */
    className: string;
    /** Type-safe DOM event listeners. Keys are event names, values receive properly typed event objects */
    listeners: { [K in keyof DocumentEventMap]?: (event: DocumentEventMap[K]) => void };
};

/**
 * Interface defining the contract for a UI Component.
 * 
 * Components follow a lifecycle pattern:
 * 1. **Construction** - Component is instantiated with configuration
 * 2. **Initialization** (`init`) - Component prepares internal state
 * 3. **Rendering** (`render`) - Component mounts to the DOM
 * 4. **Effects** (`effect`) - Side effects and event listeners are registered
 * 5. **Destruction** (`destroy`) - Cleanup and unmount
 * 
 * @typeParam T - Custom configuration properties beyond the base `TComponentConfig`.
 */
interface IComponent<T extends object> {
    /**
     * Creates a new component instance.
     * @param config - The configuration object containing root element, class names, and event listeners.
     */
    new(config: TComponentConfig<T>): this;

    /**
     * Initializes the component in memory without rendering to the DOM.
     * Use this to set up internal state, create element references, and prepare for rendering.
     * Called before `render()`.
     */
    init(): void;

    /**
     * Renders the component to the DOM.
     * Mounts the component's HTML to the configured root element.
     * Should call `effect()` after mounting to register event listeners.
     */
    render(): void;

    /**
     * Destroys the component and performs cleanup.
     * Removes the component from the DOM, unregisters event listeners,
     * and releases any held references to prevent memory leaks.
     */
    destroy(): void;

    /**
     * Generates the HTML template string for the component.
     * @returns The HTML string representation of the component's content.
     */
    toHTML(): string;

    /**
     * Registers side effects and event listeners.
     * Called after the component is mounted to the DOM.
     * Use this to attach DOM event listeners from the `listeners` config.
     */
    effect(): void;
}
```

Let's apply it to our first warm-up problem - **Star Rating**. 

### **Problem 1**  - Star Rating Component

Let's apply our framework.

**Difficulty**: Easy

**Inputs** 

1. **Design Mock-up**

![image.png](attachment:13abe202-87be-4863-bade-49367b7145dd:image.png)

1. **Expected component behavior:**
    1. User can select a rating between 1 and 5.
    2. Rating can be part of a larger `form` component.
    3. Component can be read-only.
2. **Technical details**
    1. Component should work perfectly on any device.

**Solution steps:**

**1. Component Property Model**

```tsx
type TStarRatingProps = {
    value: number;
    onValueChange: (value: number) => void;
    readOnly: boolean
}
```

**2. Implementation** 

```tsx
import { Component } from "../../utilities/component";
import styles from './star-rating.module.css'
import flex from '@course/styles'

type TStarRatingProps = {
    value: number;
    onValueChange: (value: number) => void;
    readOnly?: boolean;
}

const STAR = '⭐️';
const STARS_COUNT = 5;

export class StarRating extends Component<TStarRatingProps> {
    private value: number = 0;
    private containerEl: HTMLElement | null = null

    init(): void {
        this.value = this.config.value;
    }

    private handleClick = (event: MouseEvent): void => {
        if (this.config.readOnly) return;

        const button = (event.target as HTMLElement).closest('button');
        if (!button) return;

        const starValue = Number(button.dataset.starValue);
        if (!Number.isNaN(starValue)) {
            this.value = starValue;
            this.config.onValueChange(starValue);
            this.render();
        }
    };

    toHTML(): string {
        const readonly = this.config.readOnly ?? false;

        const stars = Array.from({ length: STARS_COUNT }, (_, index) => {
            const starValue = index + 1;
            return `
                <button
                    aria-readonly="${readonly}"
                    data-star-value="${starValue}"
                    class="${styles.star} ${flex.flexColumnCenter}"
                    aria-label="${starValue} Star${starValue === 1 ? '' : 's'}"
                    aria-checked="${this.value === starValue}"
                    role="radio"
                    type="button"
                    data-active="${this.value >= starValue}"
                    ${readonly ? 'disabled' : ''}
                >
                    <span>${STAR}</span>
                </button>
            `;
        }).join('');

        return `
            <div
                class="${styles.container}"
                role="radiogroup"
                aria-label="Star Rating"
                aria-readonly="${readonly}"
            >
                <input type="number" value="${this.value}" readonly hidden />
                <div class="${flex.flexRowCenter}">
                    ${stars}
                </div>
            </div>
        `;
    }

    effect(): void {
        this.containerEl = this.config.root.querySelector(`.${styles.container}`);
        if (this.containerEl) {
            this.containerEl.addEventListener('click', this.handleClick);
        }
    }

    render(): void {
        this.init();
        this.config.root.innerHTML = this.toHTML();
        this.effect();
    }

    destroy(): void {
        if (this.containerEl) {
            this.containerEl.removeEventListener('click', this.handleClick);
        }
        this.config.root.innerHTML = '';
        this.containerEl = null;
    }
}
```


**3. Test Cases**

# 5. Type Programming

In this section, we will focus on **TypeScript type-level programming**, including patterns and techniques commonly tested in frontend interviews.