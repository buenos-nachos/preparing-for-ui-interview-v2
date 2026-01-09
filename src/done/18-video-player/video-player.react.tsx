import css from "./video-player.module.css";
import React, { useRef, useState } from "react";

// Real video sources for different resolutions (10s clips for testing)
const VIDEO_SOURCES: Record<string, string> = {
    '1080p': 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
    '720p': 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    '360p': 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'
};
const QUALITIES = Object.keys(VIDEO_SOURCES);

export const VideoPlayerComponent = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [quality, setQuality] = useState(QUALITIES[0]);

    // Store state to restore after quality switch
    const savedState = useRef<{ time: number, wasPlaying: boolean }>({ time: 0, wasPlaying: false });
    const isSwitchingQuality = useRef(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current && !isSwitchingQuality.current) {
            const current = videoRef.current.currentTime;
            const dur = videoRef.current.duration;
            setCurrentTime(current);
            setProgress(dur > 0 ? (current / dur) * 100 : 0);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);

            // Restore state if we just switched quality
            if (isSwitchingQuality.current) {
                videoRef.current.currentTime = savedState.current.time;
                if (savedState.current.wasPlaying) {
                    videoRef.current.play().catch(e => console.error("Auto-play failed after switch", e));
                    setIsPlaying(true);
                }
                isSwitchingQuality.current = false;
            }
        }
    };

    const handleQualityChange = (newQuality: string) => {
        if (videoRef.current) {
            savedState.current = {
                time: videoRef.current.currentTime,
                wasPlaying: !videoRef.current.paused
            };
            isSwitchingQuality.current = true;
            setQuality(newQuality);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        if (videoRef.current) {
            const newTime = (newValue / 100) * duration;
            videoRef.current.currentTime = newTime;
            setProgress(newValue);
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time: number) => {
        if (!isFinite(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={css.container}>
            <video
                ref={videoRef}
                className={css.video}
                src={VIDEO_SOURCES[quality]}
                controls={false}
                playsInline
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            <div className={css.controls}>
                <button onClick={togglePlay} className={css.playButton}>
                    {isPlaying ? "⏸️" : "▶️"}
                </button>

                <span className={css.time}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className={css.progressBar}
                />

                <select
                    className={css.select}
                    value={quality}
                    onChange={(e) => handleQualityChange(e.target.value)}
                    title="Quality"
                >
                    {QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
            </div>
        </div>
    );
};


