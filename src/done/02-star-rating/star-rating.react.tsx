import { useCallback } from "react";
import css from "./star-rating.module.css";
import flex from "@course/styles";
import cx from "@course/cx";

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


