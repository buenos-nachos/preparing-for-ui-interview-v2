import { AbstractComponent, type TComponentConfig } from '../../00-abstract-component/component'
import css from './portfolio-visualizer.module.css'
import cx from '@course/cx'
import styles from '@course/styles'

export type TPortfolioNode = {
  id: string
  name: string
  value: number
  children?: TPortfolioNode[]
}

type TPortfolioStateNode = Omit<TPortfolioNode, 'children'> & {
  parentID: string | null
  children?: TPortfolioStateNode[]
}

export type TPortfolioVisualizerProps = {
  data: TPortfolioNode
}

export class PortfolioVisualizer extends AbstractComponent<TPortfolioVisualizerProps> {
  private store: Map<string, TPortfolioStateNode> = new Map()
  private root: TPortfolioStateNode | null = null

  constructor(config: TComponentConfig<TPortfolioVisualizerProps>) {
    super({
      ...config,
      listeners: ['input'],
    })
    this.prepareData()
  }

  private prepareData(): void {
    const [root, store] = this.prepare(this.config.data, null)
    this.root = root
    this.store = store
  }

  private prepare(
    data: TPortfolioNode,
    parentID: string | null,
    acc: Map<string, TPortfolioStateNode> = new Map(),
  ): [TPortfolioStateNode, Map<string, TPortfolioStateNode>] {
    const node: TPortfolioStateNode = {
      ...data,
      parentID,
      children: data.children?.map((ch) => this.prepare(ch, data.id, acc)[0]) || [],
    }
    acc.set(data.id, node)
    return [node, acc]
  }

  private renderNode(node: TPortfolioStateNode, total: number): string {
    const percentage = total > 0 ? ((node.value / total) * 100).toFixed(2) : '0.00'
    const childrenHTML =
      node.children && node.children.length > 0
        ? node.children.map((ch) => this.renderNode(ch, total)).join('')
        : ''

    return `
      <details class="${cx(styles.paddingLeft16, styles.paddingVer8, css.details)}" open>
        <summary>
          <div class="${cx(styles.flexRowBetween, styles.flexRowGap16)}">
            <strong>${node.name}</strong>
            <div class="${cx(styles.flexRowGap8)}">
              <input data-node-id="${node.id}" type="number" value="${node.value}" />
              <output class="${cx(css.output)}">${percentage}%</output>
            </div>
          </div>
        </summary>
        ${childrenHTML}
      </details>
    `
  }

  toHTML(): string {
    if (!this.root) return ''
    return `
      <div class="${cx(css.container, styles.padding16)}">
        ${this.renderNode(this.root, this.root.value)}
      </div>
    `
  }

  afterRender(): void {
    // No additional setup needed
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement
    if (target.tagName !== 'INPUT') return

    const id = target.dataset.nodeId ?? ''
    const newValue = Number(target.value)
    const node = this.store.get(id)
    if (!node) return

    // Validate: if node has children, value cannot be less than sum of children
    if (node.children && node.children.length > 0) {
      const childSum = node.children.reduce(
        (sum, ch) => sum + (this.store.get(ch.id)?.value || 0),
        0,
      )
      if (newValue < childSum) {
        target.value = String(node.value)
        return
      }
    }

    // Update node value
    node.value = newValue

    // Propagate to parents - recalculate their sums
    let current = node
    while (current.parentID) {
      const parent = this.store.get(current.parentID)
      if (!parent) break
      parent.value =
        parent.children?.reduce((sum, ch) => sum + (this.store.get(ch.id)?.value || 0), 0) || 0
      current = parent
    }

    // Update all displayed values and percentages
    this.updateDisplayedValues()
  }

  private updateDisplayedValues(): void {
    const total = this.root?.value || 0

    this.store.forEach((node) => {
      const input = this.container!.querySelector(
        `input[data-node-id="${node.id}"]`,
      ) as HTMLInputElement
      const output = input?.parentElement?.querySelector('output') as HTMLOutputElement

      if (input) {
        input.value = String(node.value)
      }
      if (output) {
        const percentage = total > 0 ? ((node.value / total) * 100).toFixed(2) : '0.00'
        output.textContent = `${percentage}%`
      }
    })
  }
}
