import { useState } from 'react'
import flex from '@course/styles'
import cx from '@course/cx'
import styles from './square-game.module.css'

const GAME_SIZE = 3

/**
 * Expected data:
 * state = [
 *   [1, 2, 3],
 *   [4, null, 5],
 *   [7, 8, 6]
 * ]
 * - 2D array of numbers and one null (empty cell)
 * - Click a cell adjacent to null to swap them
 */

type TSquareGameProps = {
  initState?: Array<Array<number | null>>
}

export const SquareGame = ({ initState }: TSquareGameProps = {}) => {
  // Step 1: State — useState initialized with initState ?? getGameState(GAME_SIZE)
  // Step 2: handleCellClick — event delegation handler:
  //   - Read data-row and data-col from clicked element
  //   - Find empty position with getEmptyPosition(state)
  //   - Validate move with validate([row, col], [emptyRow, emptyCol])
  //   - If valid, structuredClone state, swap cells, setState
  // Step 3: Render:
  //   - Display win status using isWin(state)
  //   - Board div with onClickCapture, map state rows and cells
  //   - Each cell div has data-row, data-col, conditional styling for null vs filled
  return <div>TODO: Implement</div>
}
