import css from './accordion.module.css';
import flex from '@course/styles';
import cx from '@course/cx';

export type TAccordionItem = {
    id: string;
    title: string;
    content: string;
};

export const Accordion = ({ items }: { items: TAccordionItem[] }) => {
    return (
        <div className={cx(css.container, flex.flexColumnGap12)}>
            {items.map((item) => (
                <details key={item.id} className={css.details}>
                    <summary className={cx(css.summary, flex.flexRowBetween, flex.paddingHor16, flex.paddingVer12)}>{item.title}</summary>
                    <p className={cx(css.content, flex.paddingVer16, flex.paddingHor16)}>{item.content}</p>
                </details>
            ))}
        </div>
    );
};


