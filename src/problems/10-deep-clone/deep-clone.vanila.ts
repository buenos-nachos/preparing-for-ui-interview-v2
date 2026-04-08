// bun test src/problems/10-deep-clone/test/deep-clone.test.ts
// TODO: Implement deepClone

import { detectType } from "@course/utils";

type TCollection = Map<any, any> | Set<any> | Record<any, any> | any[];

function getTarget(type: string): TCollection {
	switch (type) {
		case "map":
			return new Map();
		case "set":
			return new Set();
		case "array":
			return [];
		case "object":
			return {};
		default:
			throw new Error(`Unknown type ${type}`);
	}
}

function entries(target: TCollection): Iterable<[key: any, value: any]> {
	if (target instanceof Map || target instanceof Set || Array.isArray(target)) {
		return target.entries();
	}
	return Object.entries(target);
}

function set(target: TCollection, key: any, value: any) {
	if (target instanceof Map) {
		target.set(key, value);
		return;
	}
	if (target instanceof Set) {
		target.add(value);
		return;
	}
	if (Array.isArray(target)) {
		target[key as number] = value;
		return;
	}
	target[key] = value;
}

function deepCloneInternal<T>(a: T, cache: Map<unknown, unknown>): T {
	if (!a || typeof a !== "object") {
		return a;
	}

	const type = detectType(a);
	switch (type) {
		case "date": {
			return new Date(a as unknown as Date) as T;
		}

		case "object":
		case "map":
		case "set":
		case "array": {
			if (cache.has(a)) {
				return cache.get(a) as T;
			}
			const target = getTarget(type);
			cache.set(a, target);
			for (const [key, value] of entries(a)) {
				const childClone = deepCloneInternal(value, cache);
				set(target, key, childClone);
			}
			return target as T;
		}

		default: {
			throw new Error(`Unsupported type: ${a}`);
		}
	}
}

export function deepClone<T>(a: T): T {
	return deepCloneInternal(a, new Map());
}

// --- Examples ---
// Uncomment to test your implementation:

// const obj = { a: { b: 1 }, c: [2, 3] }
// const cloned = deepClone(obj)
// cloned.a.b = 99
// console.log(obj.a.b)     // Expected: 1 (unaffected)
// console.log(cloned.a.b)  // Expected: 99
//
// const map = new Map([['key', { value: 1 }]])
// const clonedMap = deepClone(map)
// console.log(clonedMap.get('key'))  // Expected: { value: 1 }
// console.log(clonedMap.get('key') !== map.get('key'))  // Expected: true
//
// const circular: any = { a: 1 }; circular.self = circular
// const clonedCircular = deepClone(circular)
// console.log(clonedCircular.self === clonedCircular)  // Expected: true
