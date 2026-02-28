import { useLayoutEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import styles from './heatmap.module.css'
import { HeatmapChart } from './heatmap-chart'
import flex from '@course/styles'
import cx from '@course/cx'

export type HeatmapRef = {
  addPoint: (x: number, y: number, value: number) => void
}

export const Heatmap = forwardRef<HeatmapRef, { size?: number }>(({ size = 100 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)
  const heatmap = useRef<HeatmapChart>(null)

  useImperativeHandle(ref, () => ({
    addPoint: (x, y, value) => {
      heatmap.current?.addPoint({ x, y, value })
    },
  }))

  useLayoutEffect(() => {
    if (canvasRef.current && parentRef.current) {
      heatmap.current = new HeatmapChart(
        canvasRef.current.getContext('2d')!,
        parentRef.current,
        canvasRef.current,
        size,
      )
      heatmap.current.render()
    }
  }, [size])

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (entry && parentRef.current && canvasRef.current) {
        const { width, height } = entry.contentRect

        // Sync canvas internal resolution with its display size
        canvasRef.current.width = width
        canvasRef.current.height = height

        heatmap.current?.render()
      }
    })

    if (parentRef.current) observer.observe(parentRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={parentRef} className={styles.container}>
      <canvas ref={canvasRef} className={cx(styles.canvas, flex.wh100)} />
    </div>
  )
})
