import { Component, type TComponentConfig } from "../abstract-component/component"
import styles from './accordion.module.css'

import flex from '@course/styles';
import cx from '@course/cx';

type TAccordionProps = {
    items: TAccordionItem[];
}
export type TAccordionItem = {
    id: string;
    title: string;
    content: string;
};

export class Accordion extends Component<TAccordionProps> {

    constructor(config: TComponentConfig<TAccordionProps>) {
        super({
            ...config,
            className: [styles.container, flex.flexColumnGap12, ...(config.className || [])]
        });
    }

    toHTML(): string {
        return this.config.items.map(item => {
            return `
                <details class="${styles.details}">
                    <summary class="${cx(styles.summary, flex.flexRowBetween, flex.paddingHor16, flex.paddingVer12)}">${item.title}</summary>
                    <p class="${cx(styles.content, flex.paddingVer16, flex.paddingHor16)}">${item.content}</p>
                </details>
            `
        }).join('')
    }
}