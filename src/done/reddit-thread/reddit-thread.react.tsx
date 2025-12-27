import css from "./reddit-thread.module.css";
import flex from "../../utilities/flex.module.css";
import { cx } from "../../utilities/utility";

export interface IRedditComment {
    id: string;
    nickname: string;
    text: string;
    date: string;
    replies: IRedditComment[];
}

export const MOCK_COMMENTS: IRedditComment[] = [
    {
        id: "1",
        nickname: "frontend_wizard",
        text: "This new React compiler is going to change everything! Finally we can stop worrying about useMemo everywhere.",
        date: "2 hours ago",
        replies: [
            {
                id: "2",
                nickname: "skeptic_dev",
                text: "I'll believe it when I see it. Every year there's a new 'game changer'. Remember Server Components?",
                date: "1 hour ago",
                replies: [
                    {
                        id: "3",
                        nickname: "optimist_prime",
                        text: "RSC acts actually pretty stable now. I think the compiler is the next logical step.",
                        date: "45 minutes ago",
                        replies: []
                    },
                    {
                        id: "4",
                        nickname: "jquery_fan",
                        text: "Why complicate things? jQuery did this 15 years ago.",
                        date: "30 minutes ago",
                        replies: [
                            {
                                id: "5",
                                nickname: "modern_web_audit",
                                text: "Please don't maintain my legacy apps.",
                                date: "10 minutes ago",
                                replies: []
                            }
                        ]
                    }
                ]
            },
            {
                id: "6",
                nickname: "react_core_team",
                text: "We appreciate the enthusiasm! It's currently in beta, so please report any bugs you find.",
                date: "50 minutes ago",
                replies: []
            }
        ]
    },
    {
        id: "7",
        nickname: "design_guru",
        text: "The UI looks clean but the contrast ratio on the buttons might be a bit low for accessibility.",
        date: "3 hours ago",
        replies: [
            {
                id: "8",
                nickname: "a11y_advocate",
                text: "Agreed. It fails WCAG AA standards. We should darken the blue shade.",
                date: "2 hours ago",
                replies: []
            }
        ]
    }
];

function RedditComment({
    comment,
}: {
    comment: IRedditComment;
}) {
    return (
        <article className={cx(css.comment, flex.padding16)}>
            <header className={cx(flex.flexRowBetween)}>
                <strong>{comment.nickname}</strong>
                <time>{comment.date}</time>
            </header>
            <p className={cx(flex.paddingVer8, flex.paddingHor8)}>{comment.text}</p>
            {comment.replies.length > 0 && (
                <details>
                    <summary className={css.cursorPointer}>Replies</summary>
                    <ul className={cx(flex.paddingLeft16, css.repliesList)}>
                        {comment.replies.map((reply) => (
                            <li key={reply.id}>
                                <RedditComment comment={reply} />
                            </li>
                        ))}
                    </ul>
                </details>
            )}
        </article>
    );
}
export const RedditThreadComponent = () => {
    return (
        <div className={css.container}>
            {MOCK_COMMENTS.map((comment) => (
                <RedditComment key={comment.id} comment={comment} />
            ))}
        </div>
    );
};

export const RedditThreadExample = () => <RedditThreadComponent />;
