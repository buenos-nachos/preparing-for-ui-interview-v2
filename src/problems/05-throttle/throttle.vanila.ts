// bun test src/problems/05-throttle/test/throttle.test.ts

export function throttle<TArgs extends unknown[]>(
	callback: (...args: TArgs) => void,
	throttleMs: number,
): (...args: TArgs) => void {
	if (throttleMs <= 0) {
		throw new RangeError(
			`Provided throttle delay ${throttleMs} must be greater than 0`,
		);
	}

	let throttleId: Parameters<typeof window.clearTimeout>[0];
	const clearThrottleId = () => {
		throttleId = undefined;
	};
	return function throttled(this: unknown, ...args: TArgs): void {
		if (throttleId !== undefined) {
			return;
		}
		callback.apply(this, args);
		throttleId = setTimeout(clearThrottleId, throttleMs);
	};
}

// --- Examples ---
// Uncomment to test your implementation:

// const log = throttle((msg: string) => console.log(msg), 300)
// log('a')  // fires immediately → "a"
// log('b')  // ignored (within 300ms)
// log('c')  // ignored (within 300ms)
// setTimeout(() => log('d'), 400)  // fires → "d" (300ms passed)
