// bun test src/problems/09-deep-equals/test/deep-equals.test.ts

import { detectType } from "@course/utils";

function deepEqualsInternal(
	a: unknown,
	b: unknown,
	previousPairs: Map<unknown, unknown>,
): boolean {
	if (a === b || (previousPairs.has(a) && previousPairs.get(a) === b)) {
		return true;
	}
	const typeA = detectType(a);
	const typeB = detectType(b);
	if (typeA !== typeB) {
		return false;
	}
	if (typeof a !== "object") {
		return a === b;
	}

	const defA = a as Record<string | number, unknown>;
	const defB = b as Record<string | number, unknown>;
	const keysA = new Set(Object.keys(defA));
	const keysB = new Set(Object.keys(defB));
	if (keysA.symmetricDifference(keysB).size > 0) {
		return false;
	}

	previousPairs.set(defA, defB);
	for (const key of keysA) {
		if (!deepEqualsInternal(defA[key], defB[key], previousPairs)) {
			return false;
		}
	}
	return true;
}

export function deepEquals(a: unknown, b: unknown): boolean {
	return deepEqualsInternal(a, b, new Map());
}

// --- Examples ---
// Uncomment to test your implementation:

// console.log(deepEquals(1, 1))                          // Expected: true
// console.log(deepEquals('hello', 'hello'))               // Expected: true
// console.log(deepEquals(null, undefined))                // Expected: false
// console.log(deepEquals([1, 2, 3], [1, 2, 3]))          // Expected: true
// console.log(deepEquals({ a: 1, b: 2 }, { b: 2, a: 1 })) // Expected: true
// console.log(deepEquals({ a: 1 }, { a: 2 }))            // Expected: false

// const a: any = { value: 1 }; a.self = a
// const b: any = { value: 1 }; b.self = b
// console.log(deepEquals(a, b))                           // Expected: true (circular)
