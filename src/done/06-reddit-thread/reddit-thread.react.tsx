import css from "./reddit-thread.module.css";
import flex from "@course/styles";
import cx from "@course/cx";

export interface IRedditComment {
    id: string;
    nickname: string;
    text: string;
    date: string;
    replies: IRedditComment[];
}

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

export const RedditThreadComponent = ({ comments }: { comments: IRedditComment[] }) => {
    return (
        <div className={css.container}>
            {comments.map((comment) => (
                <RedditComment key={comment.id} comment={comment} />
            ))}
        </div>
    );
};
