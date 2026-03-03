import css from './portfolio-visualizer.module.css'
import cx from '@course/cx'
import styles from '@course/styles'
import { useMemo, useState, type ChangeEvent } from 'react'

export type TPortfolioNode = {
  id: string
  name: string
  value: number
  children?: TPortfolioNode[]
}

type TPortfolioVisualizerProps = {
  data: TPortfolioNode
}

type TPortfolioStateNode = Omit<TPortfolioNode, 'children'> & {
  parentID: string | null
  children?: TPortfolioStateNode[]
}

function PortfolioNode({
  id,
  name,
  value,
  children,
  total,
}: TPortfolioStateNode & { total: number }) {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : '0.00'
  return (
    <details className={cx(styles.paddingLeft16, styles.paddingVer8, css.details)} open>
      <summary>
        <div className={cx(styles.flexRowBetween, styles.flexRowGap16)}>
          <strong>{name}</strong>
          <div className={cx(styles.flexRowGap8)}>
            <input data-node-id={id} type="number" defaultValue={value} />
            <output className={cx(css.output)}>{percentage}%</output>
          </div>
        </div>
      </summary>
      {children &&
        children.length > 0 &&
        children.map((ch) => <PortfolioNode total={total} key={ch.id} {...ch} />)}
    </details>
  )
}

function prepare(
  data: TPortfolioNode,
  parentID: string | null,
  acc: Map<string, TPortfolioStateNode> = new Map<string, TPortfolioStateNode>(),
): [TPortfolioStateNode, Map<string, TPortfolioStateNode>] {
  const node: TPortfolioStateNode = {
    ...data,
    parentID,
    children: data.children?.map((ch) => prepare(ch, data.id, acc)[0]) || [],
  }
  acc.set(data.id, node)
  return [node, acc]
}

export function PortfolioVisualizer({ data }: TPortfolioVisualizerProps) {
  const [_root, _store] = useMemo(() => prepare(data, null), [data])
  const [store, setStore] = useState<Map<string, TPortfolioStateNode>>(_store)
  const root = store.get(_root.id)

  const onNodeUpdate = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const id = target.dataset.nodeId ?? ''
    const newValue = Number(target.value)
    const node = store.get(id)
    if (!node) return

    if (node.children && node.children.length > 0) {
      const childSum = node.children.reduce((sum, ch) => sum + (store.get(ch.id)?.value || 0), 0)
      if (newValue < childSum) {
        target.value = String(node.value)
        return
      }
    }

    const newStore = new Map(store)
    newStore.set(id, { ...node, value: newValue })

    let current = node
    while (current.parentID) {
      const parent = newStore.get(current.parentID)
      if (!parent) break
      const childSum =
        parent.children?.reduce((sum, ch) => sum + (newStore.get(ch.id)?.value || 0), 0) || 0
      newStore.set(current.parentID, { ...parent, value: childSum })
      current = parent
    }
    setStore(newStore)
  }

  return (
    <div className={cx(css.container, styles.maxW600px, styles.padding16)} onChange={onNodeUpdate}>
      {root && <PortfolioNode total={root.value} {...root} />}
    </div>
  )
}
