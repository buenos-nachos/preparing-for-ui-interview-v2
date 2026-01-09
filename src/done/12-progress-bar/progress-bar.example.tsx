import { useState, useEffect } from "react";
import { ProgressBar } from "./progress-bar.react";

/**
 * Example component demonstrating the ProgressBar with animation.
 * Progress increases by 5-15% every 500ms from 0 to 100.
 */
export const ProgressBarExample = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (progress >= 100) return;

        const timer = setInterval(() => {
            setProgress(prev => {
                const increment = Math.floor(Math.random() * 11) + 5; // 5-15
                const next = prev + increment;
                return next >= 100 ? 100 : next;
            });
        }, 500);

        return () => clearInterval(timer);
    }, [progress]);

    const handleReset = () => setProgress(0);

    return (
        <div style={{ padding: '20px', maxWidth: '400px' }}>
            <h3>Progress Bar Example</h3>
            <div style={{ marginTop: '16px' }}>
                <ProgressBar value={progress} label={`${progress}%`} />
            </div>
            <button
                onClick={handleReset}
                style={{ marginTop: '16px' }}
                disabled={progress < 100}
            >
                Reset
            </button>
        </div>
    );
};
