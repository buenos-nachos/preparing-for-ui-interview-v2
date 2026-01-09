import { Component, type TComponentConfig } from "../abstract-component/component";
import { type IRedditComment } from "./reddit-thread.react";
import styles from "./reddit-thread.module.css";
import flex from "@course/styles";
import cx from "@course/cx";

export type TRedditThreadProps = {
    comments: IRedditComment[];
};

export class RedditThread extends Component<TRedditThreadProps> {
    constructor(config: TComponentConfig<TRedditThreadProps>) {
        super({
            ...config,
            className: [styles.container, ...(config.className || [])],
        });
    }

    private renderComment(comment: IRedditComment): string {
        const hasReplies = comment.replies && comment.replies.length > 0;

        return `
            <article class="${cx(styles.comment, flex.padding16)}">
                <header class="${cx(flex.flexRowBetween)}">
                    <strong>${comment.nickname}</strong>
                    <time>${comment.date}</time>
                </header>
                <p class="${cx(flex.paddingVer8, flex.paddingHor8)}">${comment.text}</p>
                ${hasReplies ? `
                    <details>
                        <summary class="${styles.cursorPointer}">Replies</summary>
                        <ul class="${cx(flex.paddingLeft16, styles.repliesList)}">
                            ${comment.replies.map(reply => `
                                <li>${this.renderComment(reply)}</li>
                            `).join('')}
                        </ul>
                    </details>
                ` : ''}
            </article>
        `;
    }

    toHTML(): string {
        return this.config.comments.map(comment => this.renderComment(comment)).join('');
    }
}
