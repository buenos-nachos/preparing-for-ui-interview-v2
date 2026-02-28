const normalize = (word: string) => word.toLowerCase()

class TrieNode<T> {
  value: T | null = null
  isEnd: boolean = false
  children: Map<string, TrieNode<T>> = new Map()

  constructor() {}
}

export class Trie<T> {
  private root: TrieNode<T>

  constructor() {
    this.root = new TrieNode<T>()
  }

  insert(word: string, value: T) {
    if (word.length === 0) {
      return
    }
    word = normalize(word)
    let node = this.root
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode<T>())
      }
      node = node.children.get(char)!
    }
    node.isEnd = true
    node.value = value
  }

  get(word: string): TrieNode<T> | null {
    word = normalize(word)
    let node = this.root
    for (const char of word) {
      if (!node.children.has(char)) {
        return null
      }
      node = node.children.get(char)!
    }
    return node
  }

  contains(word: string) {
    return this.get(word)?.isEnd ?? false
  }

  getWithPrefix(prefix: string): Array<T> {
    prefix = normalize(prefix)
    const node = this.get(prefix)
    if (node == null) return []
    return this.#collect(node.isEnd && node.value != null ? [node.value] : [], node)
  }

  #collect(acc: Array<T>, node: TrieNode<T>): Array<T> {
    for (const [, n] of node.children) {
      if (n.isEnd && n.value) {
        acc.push(n.value)
      }
      this.#collect(acc, n)
    }
    return acc
  }
}
