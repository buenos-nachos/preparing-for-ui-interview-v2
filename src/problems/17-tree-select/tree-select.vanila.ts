// bun test src/problems/17-tree-select/test/tree-select.test.ts

type TSelectStatus = 'v' | ' ' | 'o'

const SELECTED: TSelectStatus = 'v'
const NOT_SELECTED: TSelectStatus = ' '
const PARTIAL: TSelectStatus = 'o'

// Step 0: Implement TreeNode methods
class TreeNode {
  children: TreeNode[] = []
  status: TSelectStatus = NOT_SELECTED

  constructor(
    public name: string,
  ) {}

  toString(level: number = -1): string {
    const dots = Math.max(0, level)
    const root = level === -1 ? '' : `${'.'.repeat(dots)}[${this.status}]${this.name}\n`
    return root.concat(this.children.map((n) => n.toString(level + 1)).join(''))
  }
}

// Step 1: Implement createTree
//   - Create a root TreeNode and a Map<string, TreeNode> store
//   - For each path, split by '/' into tokens
//   - For each token, check if it exists in the store; if not, create a new TreeNode and addChild to parent
//   - Return [root, store]

// Step 2: Implement bubble
//   - Yield parent nodes up to the root (for updating statuses upward)

// Step 3: Implement propagate
//   - Yield all descendant children recursively (for propagating selection downward)

// Step 4: Implement renderTreeSelect
//   - Call createTree to build the tree
//   - For each click: toggle the clicked node's status, propagate to descendants, bubble up to update ancestors
//   - Return root.toString()

export const renderTreeSelect = (paths: string[], clicks: string[]): string => {
  throw new Error('Not implemented')
}
