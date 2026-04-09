// bun test src/problems/17-tree-select/test/tree-select.test.ts

type TSelectStatus = "v" | " " | "o";

const SELECTED: TSelectStatus = "v";
const NOT_SELECTED: TSelectStatus = " ";
const PARTIAL: TSelectStatus = "o";

// Step 0: Implement TreeNode methods
class TreeNode {
	readonly name: string;
	parent: TreeNode | null;
	children: TreeNode[];
	status: TSelectStatus;

	constructor(name: string, parent?: TreeNode | null) {
		this.name = name;
		this.children = [];
		this.parent = parent ?? null;
		this.status = NOT_SELECTED;
	}

	addChild(child: TreeNode): void {
		this.children.push(child);
	}

	toString(level: number = -1): string {
		const dots = Math.max(0, level);
		const root =
			level === -1 ? "" : `${".".repeat(dots)}[${this.status}]${this.name}\n`;
		return root.concat(
			this.children.map((n) => n.toString(level + 1)).join(""),
		);
	}
}

// Step 1: Implement createTree
function createTree(
	paths: string[],
): [root: TreeNode, nodeStore: Map<string, TreeNode>] {
	const root = new TreeNode("/");
	const nodeStore = new Map([["/", root]]);

	for (const p of paths) {
		let parent = root;
		const split = p.split("/");
		for (const segment of split) {
			let next = nodeStore.get(segment);
			if (next === undefined) {
				next = new TreeNode(segment, parent);
				nodeStore.set(segment, next);
				parent.children.push(next);
			}
			parent = next;
		}
	}

	return [root, nodeStore] as const;
}
//   - Create a root TreeNode and a Map<string, TreeNode> store
//   - For each path, split by '/' into tokens
//   - For each token, check if it exists in the store; if not, create a new TreeNode and addChild to parent
//   - Return [root, store]

// Step 2: Implement bubble
function* bubble(node: TreeNode): Generator<TreeNode> {
	let current: TreeNode | null = node.parent;
	while (current !== null) {
		yield current;
		current = current.parent;
	}
}

// Step 3: Implement propagate
function* propagate(node: TreeNode): Generator<TreeNode> {
	const nodeQueue: TreeNode[] = [node];
	while (nodeQueue.length > 0) {
		const next = nodeQueue.shift();
		if (next === undefined) {
			throw new Error("Unable to pop latest element from stack");
		}
		if (next !== node) {
			yield next;
		}
		for (const c of next.children) {
			nodeQueue.push(c);
		}
	}
}

// Step 4: Implement renderTreeSelect
//   - Call createTree to build the tree
//   - For each click: toggle the clicked node's status, propagate to descendants, bubble up to update ancestors
//   - Return root.toString()

export const renderTreeSelect = (paths: string[], clicks: string[]): string => {
	const [root, nodeStore] = createTree(paths);

	for (const c of clicks) {
		const node = nodeStore.get(c);
		if (node === undefined) {
			continue;
		}

		const newMark = node.status === SELECTED ? NOT_SELECTED : SELECTED;
		node.status = newMark;
		for (const descendant of propagate(node)) {
			descendant.status = newMark;
		}

		for (const parent of bubble(node)) {
			let selectedCount = 0;
			let partialCount = 0;
			for (const child of parent.children) {
				if (child.status === SELECTED) {
					selectedCount++;
				}
				if (child.status === PARTIAL) {
					partialCount++;
				}
			}

			if (selectedCount === parent.children.length) {
				parent.status = SELECTED;
			} else if (selectedCount > 0 || partialCount > 0) {
				parent.status = PARTIAL;
			}
		}
	}

	return root.toString();
};

// --- Examples ---
// Uncomment to test your implementation:
// Example 1: Basic tree rendering (no clicks)
const paths1 = ["fruits/apple", "fruits/banana", "vegetables/carrot"];
console.log(renderTreeSelect(paths1, []));
// Expected output:
// [ ]fruits
// .[ ]apple
// .[ ]banana
// [ ]vegetables
// .[ ]carrot

// Example 2: Select a leaf node → parent becomes partial
console.log(renderTreeSelect(["fruits/apple", "fruits/banana"], ["apple"]));
// Expected output:
// [o]fruits
// .[v]apple
// .[ ]banana

// Example 3: Select all children → parent becomes selected
console.log(
	renderTreeSelect(["fruits/apple", "fruits/banana"], ["apple", "banana"]),
);
// Expected output:
// [v]fruits
// .[v]apple
// .[v]banana

// Example 4: Select parent → all children become selected, then deselect one child
console.log(renderTreeSelect(["a/b", "a/c"], ["a", "b"]));
// Expected output:
// [o]a
// .[ ]b
// .[v]c
