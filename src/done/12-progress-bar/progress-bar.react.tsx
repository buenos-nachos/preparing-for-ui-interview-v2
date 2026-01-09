
import css from './progress-bar.module.css';
/**
 * Props for the ProgressBar component.
 */
interface ProgressBarProps {
    /** Current progress value (0-100) */
    value: number;
    /** Maximum value (default: 100) */
    max?: number;
    /** Optional label to display */
    label?: string;
}

/**
 * A progress bar component that displays completion status.
 * 
 * @param props - The component props
 * @returns A progress bar element
 * 
 * @example
 * ```tsx
 * <ProgressBar value={50} />
 * <ProgressBar value={75} label="Loading..." />
 * ```
 */
import cx from '@course/cx';
import flex from '@course/styles';

export const ProgressBar = ({ value, max = 100, label }: ProgressBarProps) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={label ?? `Progress: ${percentage}%`}
            className={css['progress-bar']}
        >
            <div
                className={css.progress}
                style={{ transform: `translateX(-${100 - percentage}%)` }}
            />
            {label && (
                <div
                    className={cx(css.label, flex.flexRowCenter, flex.itemsCenter, flex.justifyCenter)}
                >
                    {label}
                </div>
            )}
            {label && (
                <div
                    className={cx(css.labelOverlay, flex.flexRowCenter, flex.itemsCenter, flex.justifyCenter)}
                    style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}
                    aria-hidden="true"
                >
                    {label}
                </div>
            )}
        </div>
    );
};


