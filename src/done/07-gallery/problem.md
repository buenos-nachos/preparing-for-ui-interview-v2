# Gallery Component

**Difficulty**: `easy`

## Goal
Build an image gallery component that displays a list of images with support for navigation controls and thumbnail indicators.

## Requirements

### Core Functionality
1.  **Image Display**: Display one image at a time from a provided list.
2.  **Navigation**: Provide "Next" and "Previous" buttons to navigate through images. Buttons should be disabled when at the start or end of the list.
3.  **Thumbnails/Indicators**: Display a list of indicators (dots) representing each image. Clicking an indicator should jump to that image.

### Accessibility (A11y)
1.  Images must have `alt` attributes.
2.  Navigation buttons must have `aria-label` (e.g., "Next image").
3.  Indicators must be interactive and accessible via keyboard.
4.  Support keyboard navigation (Left/Right arrow keys).

## API Design

The component should accept the following props:

-   `images`: `string[]` - Array of image URLs to display.

## Solution Approach

1.  **State**: Maintain `currentIndex` state.
2.  **Events**:
    -   `next()`: increment index (clamped).
    -   `prev()`: decrement index (clamped).
    -   `goTo(i)`: set index.
3.  **Optimization**: Preload/lazy-load images logic (optional but good).

