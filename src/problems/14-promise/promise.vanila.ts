// bun test src/problems/14-promise/test/promise.test.ts

type Resolve<T = unknown, TReturn = void> = (value: T) => TReturn;
type Reject<Err = unknown, TReturn = void> = (error: Err) => TReturn;
type PromiseInit<T = unknown, Err = unknown> = (
	resolve: Resolve<T>,
	reject: Reject<Err>,
) => void;

type PromiseCore<T = unknown, Err = unknown> =
	| { status: "pending"; value: undefined; err: undefined }
	| { status: "fulfilled"; value: T; err: undefined }
	| { status: "rejected"; value: undefined; err: Err };

// Step 1: Define types and constants
//  - Executor
//  - OnFulfilled<T,R>
//  - OnRejected<R>
//  - Handler
//  - Update MyPromise<T> with types above
// Step 2: Define class fields
//  - handlers, status, value, isResolved
// Step 3: Implement settle, resolve, reject
// Step 4: constructor + Executor
// - Run tests for resolving / rejecting
// Step 5: Implement then<R> and catch
// Step 6: Implement handler execution
// - Run tests for then / catch and chaining
// Step 7: static resolve, static reject
// - Run tests for statics
export class MyPromise<T = unknown, Err = unknown> {
	#core: PromiseCore<T, Err>;
	#pendingResolvers: Resolve<T>[];
	#pendingRejectors: Reject<Err>[];

	constructor(init: PromiseInit<T, Err>) {
		this.#pendingResolvers = [];
		this.#pendingRejectors = [];
		this.#core = { status: "pending", value: undefined, err: undefined };

		const resolve = (value: T) => {
			if (this.#core.status !== "pending") {
				return;
			}
			this.#core = { status: "fulfilled", value: value, err: undefined };
			for (const cb of this.#pendingResolvers) {
				cb(value);
			}
			this.#pendingResolvers = [];
			this.#pendingRejectors = [];
		};

		const reject = (err: Err) => {
			if (this.#core.status !== "pending") {
				return;
			}
			this.#core = { status: "rejected", value: undefined, err: err };
			for (const cb of this.#pendingRejectors) {
				cb(err);
			}
			this.#pendingResolvers = [];
			this.#pendingRejectors = [];
		};

		try {
			init(resolve, reject);
		} catch (err) {
			reject(err as Err);
		}
	}

	then<U = unknown>(
		resolve: Resolve<T, U>,
		reject?: Reject<Err>,
	): MyPromise<U, Err> {
		if (this.#core.status === "fulfilled") {
			const remapped = resolve(this.#core.value);
			return MyPromise.resolve(remapped);
		}
		if (this.#core.status === "rejected") {
			if (reject !== undefined) {
				reject(this.#core.err);
			}
			return MyPromise.reject(this.#core.err);
		}

		return new MyPromise((chainedResolve, chainedReject) => {
			this.#pendingResolvers.push((parentValue) => {
				const remapped = resolve(parentValue);
				chainedResolve(remapped);
			});
			if (reject !== undefined) {
				this.#pendingRejectors.push((err) => {
					chainedReject(err);
				});
			}
		});
	}

	catch<U = unknown>(reject: Reject<Err, U>): MyPromise<U, Err> {
		if (this.#core.status === "fulfilled") {
			return new MyPromise(() => {
				// No-op; promise will forever be pending
			});
		}
		if (this.#core.status === "rejected") {
			const remappedErr = reject(this.#core.err);
			return MyPromise.resolve(remappedErr);
		}
		this.#pendingRejectors.push(reject);
		return new MyPromise((chainedResolve) => {
			this.#pendingRejectors.push((err) => {
				const remappedErr = reject(err);
				chainedResolve(remappedErr);
			});
		});
	}

	static resolve<T = unknown>(value: T): MyPromise<T, never> {
		return new MyPromise((resolve) => {
			resolve(value);
		});
	}

	static reject<Err = unknown>(err: Err): MyPromise<never, Err> {
		return new MyPromise((_, reject) => {
			reject(err);
		});
	}
}

// --- Examples ---
// Uncomment to test your implementation:

// --- Step 4: constructor + Executor ---
// const p1 = new MyPromise((resolve: any) => resolve(42))
// console.log(p1) // Expected: MyPromise { status: 'fulfilled', value: 42 }
//
// const p2 = new MyPromise((_: any, reject: any) => reject('error'))
// console.log(p2) // Expected: MyPromise { status: 'rejected', value: 'error' }
//
// const p3 = new MyPromise(() => { throw new Error('oops') })
// console.log(p3) // Expected: MyPromise { status: 'rejected', value: Error: oops }
//
// const p4 = new MyPromise((resolve: any) => { resolve(1); resolve(2) })
// console.log(p4) // Expected: MyPromise { status: 'fulfilled', value: 1 } (settled once)

// --- Step 6: then / catch and chaining ---
// const p5 = new MyPromise((resolve: any) => resolve(42));
// p5.then((v: any) => console.log(v)); // Expected: 42

// //
// const p6 = new MyPromise<number>((resolve) => resolve(1));
// const p6B = p6.then((v) => v + 1);
// const p6C = p6B.then((v) => console.log(v)); // Expected: 2

// //
// const p7 = new MyPromise((_: any, reject: any) => reject("error"));
// p7.catch((e: any) => console.log(e)); // Expected: "error"
// //
// new MyPromise((_: any, reject: any) => reject("error"))
//   .catch(() => "recovered")
//   .then((v: any) => console.log(v)); // Expected: "recovered"
// //
// new MyPromise((resolve: any) => resolve(1))
//   .then(() => { throw new Error('handler error') })
//   .catch((e: any) => console.log(e.message))  // Expected: "handler error"

// --- Step 7: static resolve, static reject ---
// MyPromise.resolve(99).then((v: any) => console.log(v)); // Expected: 99
// MyPromise.reject("no").catch((e: any) => console.log(e)); // Expected: "no"
