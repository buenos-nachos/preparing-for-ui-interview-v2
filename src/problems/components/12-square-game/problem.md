# Square Game (8-Puzzle)

**Difficulty**: 🔴 Hard · **Time**: 25–30 min

## What You'll Learn

- 2D grid state management
- Move validation with adjacency checks
- Win condition detection
- Array manipulation (shuffle, chunk, swap)

## Goal

Build the classic sliding puzzle (8-puzzle). A grid of numbered tiles has one empty space. Click a tile adjacent to the empty space to slide it. Arrange all tiles in order to win.

```
Start (shuffled):          Goal (solved):
┌────┬────┬────┐          ┌────┬────┬────┐
│  3 │  1 │  6 │          │  1 │  2 │  3 │
├────┼────┼────┤          ├────┼────┼────┤
│  5 │  2 │  8 │          │  4 │  5 │  6 │
├────┼────┼────┤          ├────┼────┼────┤
│  4 │  7 │    │ ← empty  │  7 │  8 │    │
└────┴────┴────┘          └────┴────┴────┘
```

## Requirements

### Core Functionality

1. **Generate board**: Create a shuffled `size × size` grid with numbers `1..n-1` and one `null` (empty).
2. **Move validation**: A tile can only move if it's **adjacent** (horizontally or vertically) to the empty space. No diagonal moves.
3. **Swap**: Click a valid tile → swap it with the empty space.
4. **Win detection**: Check if tiles are in order `[1, 2, 3, ..., null]`.
5. **New game**: Button to reshuffle and restart.

### Move Validation Logic

```
Given clicked tile at (row, col) and empty at (emptyRow, emptyCol):

Valid move = same row, adjacent column  OR  same column, adjacent row

  validHorizontally = (row === emptyRow) && |col - emptyCol| === 1
  validVertically   = (col === emptyCol) && |row - emptyRow| === 1
```

```
  ┌───┬───┬───┐
  │   │ ✓ │   │     ✓ = valid moves from empty
  ├───┼───┼───┤     ✗ = invalid (diagonal)
  │ ✓ │   │ ✓ │
  ├───┼───┼───┤
  │   │ ✓ │   │
  └───┴───┴───┘
```

### Win Condition

```ts
function isWin(grid: (number | null)[][]): boolean {
  const flat = grid.flat()
  return flat.every((val, i) =>
    i === flat.length - 1 ? val === null : val === i + 1
  )
}
```

## Utility Functions

```ts
// Shuffle an array randomly
function randomizeArray(arr) { return arr.sort(() => Math.random() - 0.5) }

// Split 1D array into 2D grid
function chunkify(arr, n) {
  return Array.from(Array(n), (_, i) => arr.slice(i * n, (i + 1) * n))
}

// Generate initial game state
function getGameState(size) {
  const arr = randomizeArray([1, 2, ..., size*size-1, null])
  return chunkify(arr, size)
}

// Find the empty cell
function getEmptyPosition(grid): [row, col]
```

## Walkthrough

### Step 1 — Initialize the board

Call `getGameState(3)` to create a shuffled 3×3 grid. Store it in state.

### Step 2 — Render the grid

Map over the 2D array. Each cell is a button (or div). The `null` cell is styled as empty. Use CSS Grid for layout.

### Step 3 — Handle clicks

On click:
1. Find the empty position
2. Validate the move (is clicked tile adjacent to empty?)
3. If valid, swap the tile with the empty space
4. Check win condition

### Step 4 — Win state

After each move, call `isWin(grid)`. If won, show a congratulations message or disable further moves.

<details>
<summary>💡 Hint — Immutable 2D array update</summary>

To swap two cells immutably:
```ts
const newGrid = grid.map(row => [...row])
newGrid[emptyRow][emptyCol] = newGrid[clickRow][clickCol]
newGrid[clickRow][clickCol] = null
```
</details>

<details>
<summary>💡 Hint — Not all shuffles are solvable</summary>

In the real 8-puzzle, only half of all permutations are solvable. For this interview problem, we skip solvability checks and just shuffle randomly. If you want to be thorough, you can check the inversion count.
</details>

## Edge Cases

| Scenario | Expected |
|---|---|
| Click the empty space | Nothing happens |
| Click a non-adjacent tile | Nothing happens |
| Click a diagonal tile | Nothing happens (not adjacent) |
| Board is already solved | Win detected immediately |
| 4×4 grid (15-puzzle) | Same logic, just larger |

## Verification

1. Board renders with shuffled numbers and one empty space.
2. Click adjacent tile → it slides into the empty space.
3. Click non-adjacent tile → nothing happens.
4. Arrange all tiles in order → win message appears.
5. Click "New Game" → board reshuffles.
