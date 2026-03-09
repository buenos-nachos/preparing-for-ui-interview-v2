import { useRef, useEffect } from 'react'
import { Tabs, Tab } from './solution/tabs.react'
import { Tabs as VanillaTabs } from './solution/tabs.vanila'
import { Tabs as StudentTabs, Tab as StudentTab } from './tabs.react'
import { Tabs as StudentVanillaTabs } from './tabs.vanila'

const VANILLA_TABS = [
  {
    name: 'Overview',
    content: `
      <h3>Project Overview</h3>
      <p>This project demonstrates a tab component built from scratch using vanilla TypeScript and the AbstractComponent pattern.</p>
      <ul>
        <li><strong>Framework:</strong> None — pure TypeScript</li>
        <li><strong>Pattern:</strong> AbstractComponent with event delegation</li>
        <li><strong>Styling:</strong> CSS Modules</li>
      </ul>
      <p>The component supports dynamic tab switching, external content targets, and keyboard navigation.</p>
    `,
  },
  {
    name: 'Features',
    content: `
      <h3>Key Features</h3>
      <ol>
        <li><strong>Click-based navigation</strong> — switch between tabs by clicking tab buttons</li>
        <li><strong>Default tab selection</strong> — specify which tab is active on mount</li>
        <li><strong>External target</strong> — optionally render content into a separate DOM element</li>
        <li><strong>Event delegation</strong> — a single click listener on the container handles all tab clicks</li>
        <li><strong>Destroy lifecycle</strong> — clean up event listeners and DOM nodes on unmount</li>
      </ol>
      <blockquote>
        <p><em>"Simplicity is the ultimate sophistication."</em> — Leonardo da Vinci</p>
      </blockquote>
    `,
  },
  {
    name: 'API',
    content: `
      <h3>Component API</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>tabs</code></td><td><code>TTabProps[]</code></td><td>Array of tab objects with <code>name</code> and <code>content</code></td></tr>
          <tr><td><code>defaultTab</code></td><td><code>string?</code></td><td>Name of the initially active tab</td></tr>
          <tr><td><code>target</code></td><td><code>HTMLElement?</code></td><td>External element to render content into</td></tr>
          <tr><td><code>root</code></td><td><code>HTMLElement</code></td><td>Container element for the component</td></tr>
          <tr><td><code>className</code></td><td><code>string[]</code></td><td>Additional CSS classes for the container</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    name: 'Usage',
    content: `
      <h3>Usage Example</h3>
      <pre><code>const tabs = new Tabs({
  root: document.getElementById('app'),
  className: [],
  tabs: [
    { name: 'Tab 1', content: '&lt;p&gt;Hello&lt;/p&gt;' },
    { name: 'Tab 2', content: '&lt;p&gt;World&lt;/p&gt;' },
  ],
  defaultTab: 'Tab 1',
})

tabs.render()

// Later, clean up:
tabs.destroy()</code></pre>
      <h4>Notes</h4>
      <ul>
        <li>Call <code>render()</code> after construction to mount the component</li>
        <li>Call <code>destroy()</code> to remove event listeners and DOM nodes</li>
        <li>Re-calling <code>render()</code> will destroy and re-create the component</li>
      </ul>
    `,
  },
  {
    name: 'Changelog',
    content: `
      <h3>Changelog</h3>
      <dl>
        <dt><strong>v1.2.0</strong> — March 2026</dt>
        <dd>Added external target support and keyboard navigation</dd>
        <dt><strong>v1.1.0</strong> — February 2026</dt>
        <dd>Refactored to use AbstractComponent base class</dd>
        <dt><strong>v1.0.0</strong> — January 2026</dt>
        <dd>Initial release with basic tab switching</dd>
      </dl>
    `,
  },
]

export function TabsExample() {
  return (
    <Tabs defaultTab="Overview">
      <Tab name="Overview">
        <h3>Project Overview</h3>
        <p>This project demonstrates a tab component built from scratch using React and TypeScript.</p>
        <ul>
          <li><strong>Framework:</strong> React 19</li>
          <li><strong>Pattern:</strong> Compound components (Tabs + Tab)</li>
          <li><strong>Styling:</strong> CSS Modules</li>
        </ul>
        <p>The component supports dynamic tab switching, portals for external content targets, and children-based API.</p>
      </Tab>
      <Tab name="Features">
        <h3>Key Features</h3>
        <ol>
          <li><strong>Click-based navigation</strong> — switch between tabs by clicking tab buttons</li>
          <li><strong>Default tab selection</strong> — specify which tab is active on mount</li>
          <li><strong>Portal support</strong> — optionally render content into a separate DOM element via <code>createPortal</code></li>
          <li><strong>Compound component pattern</strong> — declarative API using <code>&lt;Tabs&gt;</code> and <code>&lt;Tab&gt;</code></li>
          <li><strong>Children-based content</strong> — tab content is passed as JSX children</li>
        </ol>
        <blockquote>
          <p><em>&quot;Simplicity is the ultimate sophistication.&quot;</em> — Leonardo da Vinci</p>
        </blockquote>
      </Tab>
      <Tab name="API">
        <h3>Component API</h3>
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr><th>Prop</th><th>Type</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>Tab components as children</td></tr>
            <tr><td><code>defaultTab</code></td><td><code>string?</code></td><td>Name of the initially active tab</td></tr>
            <tr><td><code>target</code></td><td><code>HTMLElement?</code></td><td>External element to render content into via portal</td></tr>
          </tbody>
        </table>
      </Tab>
      <Tab name="Usage">
        <h3>Usage Example</h3>
        <pre><code>{`<Tabs defaultTab="Tab 1">
  <Tab name="Tab 1">
    <p>Hello</p>
  </Tab>
  <Tab name="Tab 2">
    <p>World</p>
  </Tab>
</Tabs>`}</code></pre>
        <h4>Notes</h4>
        <ul>
          <li>Each <code>&lt;Tab&gt;</code> must have a unique <code>name</code> prop</li>
          <li>Content is rendered lazily — only the active tab&apos;s children are mounted</li>
          <li>Use <code>target</code> prop to render content outside the tabs container</li>
        </ul>
      </Tab>
      <Tab name="Changelog">
        <h3>Changelog</h3>
        <dl>
          <dt><strong>v1.2.0</strong> — March 2026</dt>
          <dd>Added portal support for external content targets</dd>
          <dt><strong>v1.1.0</strong> — February 2026</dt>
          <dd>Refactored to compound component pattern</dd>
          <dt><strong>v1.0.0</strong> — January 2026</dt>
          <dd>Initial release with basic tab switching</dd>
        </dl>
      </Tab>
    </Tabs>
  )
}

export function TabsVanillaExample() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return

    const tabs = new VanillaTabs({
      root: rootRef.current,
      className: [],
      tabs: VANILLA_TABS,
      defaultTab: 'Overview',
    })

    tabs.render()

    return () => tabs.destroy()
  }, [])

  return <div ref={rootRef}></div>
}

export function TabsStudentExample() {
  return (
    <StudentTabs defaultTab="Overview">
      <StudentTab name="Overview">
        <h3>Project Overview</h3>
        <p>This project demonstrates a tab component built from scratch using React and TypeScript.</p>
        <ul>
          <li><strong>Framework:</strong> React 19</li>
          <li><strong>Pattern:</strong> Compound components (Tabs + Tab)</li>
          <li><strong>Styling:</strong> CSS Modules</li>
        </ul>
        <p>The component supports dynamic tab switching, portals for external content targets, and children-based API.</p>
      </StudentTab>
      <StudentTab name="Features">
        <h3>Key Features</h3>
        <ol>
          <li><strong>Click-based navigation</strong> — switch between tabs by clicking tab buttons</li>
          <li><strong>Default tab selection</strong> — specify which tab is active on mount</li>
          <li><strong>Portal support</strong> — optionally render content into a separate DOM element</li>
        </ol>
      </StudentTab>
      <StudentTab name="API">
        <h3>Component API</h3>
        <p>See the reference implementation for full API details.</p>
      </StudentTab>
    </StudentTabs>
  )
}

export function TabsStudentVanillaExample() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return

    const tabs = new StudentVanillaTabs({
      root: rootRef.current,
      className: [],
      tabs: VANILLA_TABS,
      defaultTab: 'Overview',
    })

    tabs.render()

    return () => tabs.destroy()
  }, [])

  return <div ref={rootRef}></div>
}
