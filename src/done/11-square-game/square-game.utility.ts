export function randomizeArray(arr: Array<number | null>, size: number): Array<number | null> {
    for (let i = 0; i < arr.length; i++) {
        const newIndex = Math.round(Math.random() * (size - 1));
        [arr[i], arr[newIndex]] = [arr[newIndex], arr[i]];
    }
    return arr;
}

function chunkify(
    arr: Array<number | null>,
    n: number
): Array<Array<number | null>> {
    return Array.from(Array(n), (_, i) => arr.slice(i * n, (i + 1) * n));
}

export function getGameState(size: number): Array<Array<number | null>> {
    let arr = Array(size * size)
        .fill(null)
        .map((_, i) => (i === size * size - 1 ? null : i));
    arr = randomizeArray(arr, size);
    return chunkify(arr, size);
}

export function validate(
    [row, col]: [number, number],
    [emptyRow, emptyCol]: [number, number]
) {
    const validHorizontally =
        row === emptyRow && (col === emptyCol + 1 || col === emptyCol - 1);
    const validVertically =
        col === emptyCol && (row === emptyRow + 1 || row === emptyRow - 1);
    return validHorizontally || validVertically;
}

export function getEmptyPosition(arr: Array<Array<number | null>>): [number, number] {
    for (let row = 0; row < arr.length; row++) {
        for (let col = 0; col < arr[0].length; col++) {
            if (arr[row][col] === null) {
                return [row, col];
            }
        }
    }
    throw Error("Invalid array");
}

export function isWin(arr: Array<Array<number | null>>): boolean {
    return arr.flat(Infinity).join("") === "12345678null";
}