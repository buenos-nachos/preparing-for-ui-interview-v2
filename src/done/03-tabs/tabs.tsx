import { Component, type TComponentConfig } from "../abstract-component/component";
import flex from '@course/styles';
import cx from '@course/cx';
import css from './tabs.module.css';


export type TTabProps = {
    name: string;
    content: string;
};

export type TTabsProps = {
    target?: HTMLElement;
    defaultTab?: string;
    tabs: TTabProps[];
}

export class Tabs extends Component<TTabsProps> {
    #defaultTab: string;
    #contentContainer: HTMLElement | null = null;
    #activeTabName: string | undefined;

    constructor(config: TComponentConfig<TTabsProps>) {
        super({
            ...config,
            listeners: ['click']
        });
        this.#defaultTab = config.defaultTab || config.tabs[0].name;
    }

    toHTML(): string {
        const { className, target } = this.config;
        const classes = cx(...(className ?? []));
        const contentHtml = target ? "" : `<section class="${css.container}"></section>`;

        return `
            <nav class="${classes}">
                <ul class="${cx(flex.flexRowStart, flex.flexGap16)}">
                    ${this.#getTabs()}
                </ul>
            </nav>
            ${contentHtml}
        `;
    }

    afterRender(): void {
        if (!this.config.target) {
            this.#contentContainer = this.container!.querySelector(`.${css.container}`);
        }
        this.#activateTab(this.#defaultTab);
    }

    onClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const button = target.closest("button");

        if (!button) return;

        const tabName = button.dataset.tabName;
        if (tabName && tabName !== this.#activeTabName) {
            this.#activateTab(tabName);
        }
    }

    #activateTab(tabName: string): void {
        const tab = this.config.tabs.find((t) => t.name === tabName);
        if (!tab) return;

        this.#activeTabName = tabName;
        const { content } = tab;

        // Update target container (external or internal)
        const container = this.config.target || this.#contentContainer;
        if (container) {
            container.innerHTML = content;
        }
    }

    #getTabs(): string {
        const { tabs } = this.config;
        return tabs
            .map(
                (tab) =>
                    `<li><button data-tab-name="${tab.name}">${tab.name}</button></li>`
            )
            .join("");
    }
}
