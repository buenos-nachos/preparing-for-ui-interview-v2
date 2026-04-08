// bun test src/problems/02-debounce/test/debounce.test.ts

export function debounce<TArgs extends unknown[]>(
	callback: (...args: TArgs) => void,
	delayMs: number,
): (...args: TArgs) => void {
	if (delayMs <= 0) {
		throw new RangeError(`Provided delay must be greater than or equal to 0`);
	}

	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	return function debounced(this: unknown, ...args: TArgs): void {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			try {
				callback.apply(this, args);
			} finally {
				if (timeoutId !== null) {
					clearTimeout(timeoutId);
				}
				timeoutId = null;
			}
		}, delayMs);
	};
}

// --- Examples ---
// Uncomment to test your implementation:

// const log = debounce((msg: string) => console.log(msg), 300);
// log("a"); // cancelled by next call
// log("b"); // cancelled by next call
// log("c"); // only this one fires after 300ms → "c"
