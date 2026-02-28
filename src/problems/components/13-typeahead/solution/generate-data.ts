const CATEGORIES: Record<string, string[]> = {
  react: [
    'React',
    'React Hooks',
    'React Router',
    'React Redux',
    'React Context',
    'React Suspense',
    'React Server Components',
    'React Native',
    'React Testing Library',
    'React Query',
    'React Hook Form',
    'React Spring',
    'React Fiber',
    'React Concurrent Mode',
    'React Portals',
  ],
  javascript: [
    'JavaScript',
    'JavaScript Promises',
    'JavaScript Async Await',
    'JavaScript Closures',
    'JavaScript Prototypes',
    'JavaScript Event Loop',
    'JavaScript Modules',
    'JavaScript Proxy',
    'JavaScript Generators',
    'JavaScript Iterators',
    'JavaScript WeakMap',
    'JavaScript WeakRef',
    'JavaScript Symbol',
    'JavaScript BigInt',
    'JavaScript Intl',
  ],
  typescript: [
    'TypeScript',
    'TypeScript Generics',
    'TypeScript Utility Types',
    'TypeScript Mapped Types',
    'TypeScript Conditional Types',
    'TypeScript Infer',
    'TypeScript Decorators',
    'TypeScript Enums',
    'TypeScript Interfaces',
    'TypeScript Type Guards',
    'TypeScript Template Literals',
    'TypeScript Discriminated Unions',
    'TypeScript Satisfies',
    'TypeScript Const Assertions',
    'TypeScript Module Resolution',
  ],
  css: [
    'CSS Grid',
    'CSS Flexbox',
    'CSS Variables',
    'CSS Animations',
    'CSS Transitions',
    'CSS Transforms',
    'CSS Media Queries',
    'CSS Container Queries',
    'CSS Cascade Layers',
    'CSS Subgrid',
    'CSS Nesting',
    'CSS Scroll Snap',
    'CSS Clamp',
    'CSS Has Selector',
    'CSS Color Mix',
  ],
  node: [
    'Node.js',
    'Node.js Streams',
    'Node.js Cluster',
    'Node.js Worker Threads',
    'Node.js File System',
    'Node.js HTTP',
    'Node.js Events',
    'Node.js Buffer',
    'Node.js Child Process',
    'Node.js Crypto',
  ],
  web: [
    'Web Components',
    'Web Workers',
    'Web Sockets',
    'Web Assembly',
    'Web Storage',
    'Web Animations API',
    'Web Audio API',
    'Web Bluetooth',
    'Web RTC',
    'Web Vitals',
  ],
  data: [
    'Data Structures',
    'Data Structures Array',
    'Data Structures Linked List',
    'Data Structures Stack',
    'Data Structures Queue',
    'Data Structures Tree',
    'Data Structures Trie',
    'Data Structures Graph',
    'Data Structures Heap',
    'Data Structures Hash Map',
  ],
  design: [
    'Design Patterns',
    'Design Patterns Observer',
    'Design Patterns Singleton',
    'Design Patterns Factory',
    'Design Patterns Strategy',
    'Design Patterns Decorator',
    'Design Patterns Adapter',
    'Design Patterns Proxy',
    'Design Patterns Command',
    'Design Patterns Iterator',
  ],
  testing: [
    'Testing',
    'Testing Unit Tests',
    'Testing Integration Tests',
    'Testing E2E Tests',
    'Testing Mocking',
    'Testing Snapshot',
    'Testing Coverage',
    'Testing TDD',
    'Testing BDD',
    'Testing Performance',
  ],
  performance: [
    'Performance',
    'Performance Lazy Loading',
    'Performance Code Splitting',
    'Performance Tree Shaking',
    'Performance Memoization',
    'Performance Virtualization',
    'Performance Debouncing',
    'Performance Throttling',
    'Performance Web Workers',
    'Performance Caching',
  ],
}

const generateData = () => {
  const data: { id: string; query: string; value: string }[] = []
  let id = 1

  for (const [category, items] of Object.entries(CATEGORIES)) {
    for (const item of items) {
      data.push({
        id: String(id++),
        query: item,
        value: `${item} — ${category}`,
      })
    }
  }

  return data
}

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const data = generateData()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.join(__dirname, '..', 'data.json')

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
console.log(`Generated ${data.length} entries to ${outputPath}`)
