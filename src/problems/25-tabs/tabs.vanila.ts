import {AbstractComponent, type TComponentConfig} from '@course/utils'
import flex from '@course/styles'
import cx from '@course/cx'
import css from './tabs.module.css'

export type TTabProps = {
    name: string
    content: string
}

export type TTabsProps = {
    target?: HTMLElement
    defaultTab?: string
    tabs: TTabProps[]
}

/**
 * Expected input:
 * {
 *   "tabs": [
 *     { "name": "Tab 1", "content": "<p>Content for tab 1</p>" },
 *     { "name": "Tab 2", "content": "<p>Content for tab 2</p>" }
 *   ],
 *   "defaultTab": "Tab 1",
 *   "target": HTMLElement (optional, external container for tab content)
 * }
 *
 * Step 1: Extend AbstractComponent<TTabsProps>
 * - Call super() with config, adding listeners: ['click']
 * - Store the default tab name (from config.defaultTab or first tab's name)
 */
export class Tabs extends AbstractComponent<TTabsProps> {
    constructor(config: TComponentConfig<TTabsProps>) {
        super({
            ...config,
            listeners: ['click'],
        })
    }

    /**
     * Step 2: Implement toHTML
     * - Render a <nav> with a <ul role="tablist"> containing tab buttons (use #getTabs helper)
     * - Each <li> should have role="presentation"
     * - Each <button> should have: role="tab", id="tab-{name}", aria-controls="tab-panel",
     *   aria-selected="false"
     * - If no external target, render a <section role="tabpanel" id="tab-panel" aria-labelledby="tab-{defaultTab}">
     * - Use cx() and flex utilities for layout (flexRowStart, flexGap16)
     */
    toHTML(): string {
        // TODO: implement
        return ''
    }

    getTab({name}: TTabProps) {
        return `<li role="presentation"><button role="tab" id="tab-${name}" data-tab="${name}" aria-controls="tab-panel" aria-selected="false">${name}</button></li>`
    }

    /**
     * Step 3: Implement afterRender
     * - If no external target, query the content container from this.container
     * - Activate the default tab
     */
    afterRender(): void {
        // TODO: implement
    }

    /**
     * Step 4: Implement activate
     * - Update aria-selected on all tab buttons (true for active, false for others)
     * - Update the content panel's innerHTML and aria-labelledby="tab-{tabName}"
     */
    activate(tab: string) {
        // TODO: implement
    }

    /**
     * Step 5: Implement onClick
     * - Find the closest <button> from event.target
     * - Read data-tab attribute
     * - If tab name changed, activate the new tab
     */
    onClick({target}: MouseEvent): void {
        // TODO: implement
    }
}

/**
 * Step 6: Accessibility (a11y)
 * The following ARIA attributes are used in this component:
 *
 * Container:
 * - role="tablist" (on <ul>) — identifies the element as a container for tab controls,
 *   telling assistive technologies this is a set of tabs, not a regular list
 *
 * Tab items:
 * - role="presentation" (on <li>) — removes the list item semantics so screen readers
 *   don't announce "list item 1 of 3"; the meaningful role is on the <button> inside
 *
 * Tab buttons:
 * - role="tab" (on <button>) — identifies each button as a tab control, so screen readers
 *   announce it as "tab" rather than just "button"
 * - id="tab-{name}" — unique identifier used by aria-labelledby on the panel to create
 *   a programmatic link between the tab and its content
 * - aria-controls="tab-panel" — points to the id of the content panel this tab controls,
 *   allowing assistive technologies to navigate directly from tab to panel
 * - aria-selected="true|false" — indicates which tab is currently active; screen readers
 *   announce "selected" for the active tab so users know which tab they're on
 * - data-tab="{name}" — not an ARIA attribute, but used for click handling to identify
 *   which tab was clicked
 *
 * Content panel:
 * - role="tabpanel" (on <section>) — identifies the content area as a tab panel,
 *   so screen readers announce it as "tab panel" when the user navigates to it
 * - id="tab-panel" — unique identifier referenced by aria-controls on each tab button
 * - aria-labelledby="tab-{activeTab}" — links the panel to the currently active tab button,
 *   so screen readers announce the panel's label as the active tab's name (e.g., "Tab 1 tab panel")
 */
