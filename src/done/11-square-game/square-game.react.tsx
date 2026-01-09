import { useState } from 'react';
import flex from '@course/styles';
import cx from '@course/cx';
import styles from './square-game.module.css';
import { getEmptyPosition, getGameState, isWin, validate } from "./square-game.utility";

const GAME_SIZE = 3;

export const SquareGame = () => {
    const [state, setState] = useState(getGameState(GAME_SIZE));

    const handleCellClick: React.MouseEventHandler = ({ target }) => {
        if (!(target instanceof HTMLElement)) {
            return;
        }
        let [rowIndex, colIndex] = [Number(target.dataset.row), Number(target.dataset.col)];
        if (isNaN(rowIndex) || isNaN(colIndex)) {
            return;
        }
        const [emptyRow, emptyCol] = getEmptyPosition(state);
        if (validate([rowIndex, colIndex], [emptyRow, emptyCol])) {
            const newState = state.map(row => [...row]);
            [newState[rowIndex][colIndex], newState[emptyRow][emptyCol]] = [
                newState[emptyRow][emptyCol],
                newState[rowIndex][colIndex]
            ];
            setState(newState);
        }
    };

    return (
        <section className={cx(flex.flexColumnCenter, flex.flexGap16)}>
            <div>Game status: {isWin(state) ? "win" : "not yet"}</div>
            <div onClickCapture={handleCellClick} className={cx(styles.board)}>{state.map((row, rowIndex) => (
                <>
                    {row.map((col, colIndex) => (
                        <div
                            key={colIndex}
                            className={cx(styles.cell, flex.flexRowCenter, col == null ? styles.cell__empty : styles.cell__filled)}
                            data-row={rowIndex}
                            data-col={colIndex}>
                            {col}
                        </div>
                    ))}
                </>
            ))}</div>
        </section>
    );
};


