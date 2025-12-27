import { useCallback, useState } from "react";
import css from "./star-rating.module.css";
import flex from "../../utilities/flex.module.css";
import { cx } from "../../utilities/utility";

const EMOJIS = [
    "⭐️",
    "⭐️",
    "⭐️",
    "⭐️",
    "⭐️",
] as const;

type TStarRatingProps = {
    readonly?: boolean;
    value: number;
    onChange: (value: number) => void;
}
export const StarRatingComponent = ({ readonly, value, onChange }: TStarRatingProps) => {
    const handleStarClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (readonly) return;
        const button = (event.target as HTMLElement).closest('button');
        if (!button) return;
        const starValue = Number(button.dataset.starValue);
        if (!Number.isNaN(starValue)) {
            onChange(starValue);
        }
    }, [readonly, onChange]);

    return (
        <div
            className={css.container}
            onClick={handleStarClick}
            role="radiogroup"
            aria-label="Star Rating"
            aria-readonly={readonly}
        >
            <input type="number" value={value} readOnly hidden />
            <div className={flex.flexRowCenter}>
                {EMOJIS.map((emoji, index) => {
                    const starValue = index + 1;
                    return (
                        <button
                            aria-readonly={readonly}
                            data-star-value={starValue}
                            className={cx(css.star, flex.flexColumnCenter)}
                            aria-label={`${starValue} Star${starValue === 1 ? '' : 's'}`}
                            aria-checked={value === starValue}
                            role="radio"
                            type="button"
                            key={index}
                            data-active={value >= starValue}
                            disabled={readonly}
                        >
                            <span>{emoji}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export const StarRatingExample = () => {
    const [rating, setRating] = useState(0);

    return (
        <div className={flex.flexColumnGap24}>
            <div className={flex.flexColumnGap8}>
                <h3>Interactive Rating</h3>
                <StarRatingComponent value={rating} onChange={setRating} />
                <p>Current Value: {rating}</p>
            </div>

            <div className={flex.flexColumnGap8}>
                <h3>Readonly (3 Stars)</h3>
                <StarRatingComponent readonly value={3} onChange={() => { }} />
            </div>

            <div className={flex.flexColumnGap8}>
                <h3>Readonly (5 Stars)</h3>
                <StarRatingComponent readonly value={5} onChange={() => { }} />
            </div>
        </div>
    );
};
