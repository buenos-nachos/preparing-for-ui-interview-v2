import cx from "@course/cx";
import flex from "@course/styles";
import { AbstractComponent } from "@course/utils";
import css from "./accordion.module.css";

/**
 * Expected input:
 * {
 *   root: HTMLElement,
 *   items: [
 *     { id: "1", title: "Section 1", content: "Lorem ipsum..." },
 *     { id: "2", title: "Section 2", content: "Sed ut perspiciatis..." }
 *   ]
 * }
 *
 * Steps to complete:
 * 1. Define properties — create TAccordionItem type (id, title, content) and TAccordionProps (items array)
 * 2. Init constructor — call super with config, add CSS classes (styles.container, flex utilities)
 * 3. Provide toHTML template — map over items, render <details>/<summary>/<p> for each
 * 4. Add CSS — use styles and cx() for className composition
 */
type AccordionItem = {
	id: string;
	title: string;
	content: string;
};

type AccordionProps = {
	items: AccordionItem[];
};

export class Accordion extends AbstractComponent<AccordionProps> {
	toHTML(): string {
		const content = this.config.items
			.map((it) => this.createAccordionPanel(it))
			.join("");
		return `
		  <div class="${cx(css.container, flex.maxW600px, flex.flexColumnGap12, flex.w100)}">
				${content}
			</div>
		`;
	}

	createAccordionPanel(item: AccordionItem): string {
		return `
			<details class="${css.details}">
			  <summary class="${cx(css.summary, flex.flexRowBetween, flex.paddingHor16, flex.paddingVer12, flex.fontXL)}">
					${item.title}
				</summary>
				<p class="${cx(css.content, flex.paddingHor16, flex.paddingVer16)}">
				  ${item.content}
				</p>
			</details>
		`;
	}
}
