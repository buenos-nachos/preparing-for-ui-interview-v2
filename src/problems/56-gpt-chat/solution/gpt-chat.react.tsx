import css from './gpt-chat.module.css'
import flex from '@course/styles'
import cx from '@course/cx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Markdown } from '../../55-markdown/solution/markdown.react'
import { useMarkdownStream } from '../../../utilities/use-markdown-stream'

export const GPTComponent = () => {
  const [chunks, setChunks] = useState<string[]>([])
  const [content, setContent] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const { stream, abort, inProgress } = useMarkdownStream()

  const contentRef = useRef<HTMLElement | null>(null)

  const handleSend = () => {
    setChunks([])
    stream((chunk) => {
      setChunks((prev) => [...prev, chunk])
    })
  }

  const type = useCallback(function recursiveType(chunk: string) {
    if (chunk.length === 0) {
      setIsTyping(false)
      return
    }
    const charsToType = 2
    const chars = chunk.slice(0, charsToType)
    const rest = chunk.slice(charsToType)
    setContent((prev) => prev + chars)
    if (rest.length > 0) {
      requestAnimationFrame(() => recursiveType(rest))
    } else {
      setIsTyping(false)
    }
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  useEffect(() => {
    if (!isTyping && chunks.length > 0) {
      setIsTyping(true)
      const [nextChunk, ...rest] = chunks
      setChunks(rest)
      type(nextChunk)
    }
  }, [chunks, isTyping, type])

  return (
    <div className={cx(css.container, flex.w100)}>
      <section className={css.content} ref={contentRef}>
        <Markdown text={content} />
      </section>
      <section className={cx(flex.flexRowCenter, flex.flexGap32)}>
        <textarea className={cx(css.textarea, flex.w100, flex.maxW500px)}></textarea>
        {inProgress ? (
          <button className={css.button} onClick={abort}>
            Stop
          </button>
        ) : (
          <button className={css.button} onClick={handleSend}>
            Send
          </button>
        )}
      </section>
    </div>
  )
}
