import css from "./gpt-chat.module.css";
import flex from '@course/styles';
import cx from '@course/cx';
import { useEffect, useRef, useState } from "react";
import { Markdown } from "../10-markdown/markdown.react";

type StreamCallback = (chunk: string) => void;

type StreamOptions = {
    onComplete?: () => void;
    onError?: (error: Error) => void;
    delay?: number;
};

/**
 * Hook for streaming markdown content from the server.
 * @param options - Optional configuration for completion/error callbacks and delay
 * @returns Object with stream, abort functions and inProgress state
 */
export function useMarkdownStream(options: StreamOptions = {}) {
    const { onComplete, onError, delay = 500 } = options;
    const controllerRef = useRef<AbortController | null>(null);
    const [inProgress, setInProgress] = useState(false);

    const stream = (onChunk: StreamCallback) => {
        // Abort any existing stream before starting a new one
        controllerRef.current?.abort();

        const controller = new AbortController();
        controllerRef.current = controller;
        setInProgress(true);

        (async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/stream-markdown?delay=${delay}`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }

                const reader = response.body?.getReader();
                if (!reader) {
                    throw new Error("No readable stream available");
                }

                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const text = decoder.decode(value, { stream: true });
                    onChunk(text);
                }

                onComplete?.();
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Stream error:", error);
                    onError?.(error as Error);
                }
            } finally {
                controllerRef.current = null;
                setInProgress(false);
            }
        })();
    };

    const abort = () => {
        controllerRef.current?.abort();
        controllerRef.current = null;
        setInProgress(false);
    };

    return { stream, abort, inProgress };
}

export const GPTComponent = () => {
    const [chunks, setChunks] = useState<string[]>([]);
    const [content, setContent] = useState<string>("");
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const { stream, abort, inProgress } = useMarkdownStream();

    const contentRef = useRef<HTMLElement | null>(null);

    const handleSend = () => {
        setChunks([]);
        stream((chunk) => {
            setChunks((prev) => [...prev, chunk]);
        });
    };

    const type = (chunk: string) => {
        if (chunk.length === 0) {
            setIsTyping(false);
            return;
        }
        const charsToType = 2;
        const chars = chunk.slice(0, charsToType);
        const rest = chunk.slice(charsToType);
        setContent((prev) => prev + chars);
        if (rest.length > 0) {
            requestAnimationFrame(() => type(rest));
        } else {
            setIsTyping(false);
        }
        contentRef.current?.scrollTo({
            top: contentRef.current.scrollHeight,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        if (!isTyping && chunks.length > 0) {
            setIsTyping(true);
            const [nextChunk, ...rest] = chunks;
            setChunks(rest);
            type(nextChunk);
        }
    }, [chunks, isTyping]);

    return (
        <div className={css.container}>
            <section className={css.content} ref={contentRef}>
                <Markdown text={content} />
            </section>
            <section className={cx(flex.flexRowCenter, flex.flexGap32)}>
                <textarea className={css.textarea}></textarea>
                {inProgress ? (
                    <button className={css.button} onClick={abort}>Stop</button>
                ) : (
                    <button className={css.button} onClick={handleSend}>Send</button>
                )}
            </section>
        </div>
    );
};


