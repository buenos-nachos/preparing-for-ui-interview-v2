import React, { useState, type PropsWithChildren, type ReactElement, type RefObject } from 'react'
import flex from '@course/styles'
import tabs from './tabs.module.css'
import cx from '@course/cx'
import { createPortal } from 'react-dom'

type TTabProps = PropsWithChildren<{
  name: string
  isActive?: boolean
}>

type TTabsProps = {
  target?: RefObject<HTMLElement>
  defaultTab?: string
  children: ReactElement<TTabProps, typeof Tab>[]
}

export function Tab({ name, isActive }: TTabProps) {
  return (
    <li role="presentation">
      <button
        role="tab"
        id={`tab-${name}`}
        data-tab-name={name}
        aria-selected={isActive}
        aria-controls="tab-panel"
      >
        {name}
      </button>
    </li>
  )
}

export function Tabs({ defaultTab, children, target }: TTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || children[0].props.name)

  const handleTabClick = ({ target }: React.MouseEvent<HTMLUListElement>) => {
    if (target instanceof HTMLButtonElement) {
      const tabName = target.dataset.tabName
      if (tabName) setActiveTab(tabName)
    }
  }

  const content = children.find((child) => child.props.name === activeTab)?.props.children
  return (
    <div>
      <nav>
        <ul role="tablist" onClickCapture={handleTabClick} className={cx(flex.flexRowStart, flex.flexGap16)}>
          {children.map((child) =>
            React.cloneElement(child, { isActive: child.props.name === activeTab })
          )}
        </ul>
      </nav>
      {content && target?.current != null ? (
        createPortal(
          <div role="tabpanel" id="tab-panel" aria-labelledby={`tab-${activeTab}`}>{content}</div>,
          target.current
        )
      ) : (
        <section role="tabpanel" id="tab-panel" aria-labelledby={`tab-${activeTab}`} className={tabs.container}>{content}</section>
      )}
    </div>
  )
}
