import { Heatmap, type HeatmapRef } from './solution/heatmap.react'
import { Heatmap as HeatmapStudent } from './heatmap.react'
import { Heatmap as HeatmapVanilaStudent } from './heatmap.vanila'
import { Heatmap as VanillaHeatmap } from './solution/heatmap.vanila'
import { useEffect, useRef, useState, useCallback } from 'react'

const getRandomPoint = (size: number) => ({
  x: Math.floor(Math.random() * size),
  y: Math.floor(Math.random() * size),
  value: Math.random() * 0.5 + 0.1,
})

export const HeatmapExample = () => {
  const ref = useRef<HeatmapRef>(null)
  const [size, setSize] = useState(20)
  const [inputValue, setInputValue] = useState('20')

  const addRandomPoint = useCallback(() => {
    if (!ref.current) return
    const { x, y, value } = getRandomPoint(size)
    ref.current.addPoint(x, y, value)
  }, [size])

  const handleStart = () => {
    const newSize = parseInt(inputValue, 10)
    if (!isNaN(newSize) && newSize > 0) {
      setSize(newSize)
    }
  }

  useEffect(() => {
    const interval = setInterval(addRandomPoint, 100)
    return () => clearInterval(interval)
  }, [addRandomPoint])

  return (
    <div style={{ padding: 20 }}>
      <h3>React Heatmap</h3>
      <div style={{ marginBottom: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
        <label>
          Grid Size:
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ padding: 4, marginLeft: 4, width: 60 }}
          />
        </label>
        <button onClick={handleStart}>Start</button>
        <button onClick={addRandomPoint}>Add Point manually</button>
      </div>
      <Heatmap ref={ref} size={size} />
    </div>
  )
}

export const HeatmapVanillaExample = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<VanillaHeatmap | null>(null)
  const [size, setSize] = useState(20)
  const [inputValue, setInputValue] = useState('20')

  const addRandomPoint = useCallback(() => {
    if (!instanceRef.current) return
    const { x, y, value } = getRandomPoint(size)
    instanceRef.current.addPoint(x, y, value)
  }, [size])

  const handleStart = () => {
    const newSize = parseInt(inputValue, 10)
    if (!isNaN(newSize) && newSize > 0) {
      setSize(newSize)
    }
  }

  useEffect(() => {
    if (!rootRef.current) return

    // Cleanup previous instance
    if (instanceRef.current) {
      instanceRef.current.destroy()
    }

    // Create new instance
    instanceRef.current = new VanillaHeatmap({
      root: rootRef.current,
      size: size,
    })
    instanceRef.current.render()

    const interval = setInterval(addRandomPoint, 100)

    return () => {
      clearInterval(interval)
      instanceRef.current?.destroy()
      instanceRef.current = null
    }
  }, [size, addRandomPoint])

  return (
    <div style={{ padding: 20 }} ref={rootRef}>
      <h3>Vanilla Heatmap</h3>
      <div style={{ marginBottom: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
        <label>
          Grid Size:
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ padding: 4, marginLeft: 4, width: 60 }}
          />
        </label>
        <button onClick={handleStart}>Start</button>
        <button onClick={addRandomPoint}>Add Point manually</button>
      </div>
    </div>
  )
}
export const HeatmapStudentExample = () => {
  return <HeatmapStudent />
}
export const HeatmapStudentVanillaExample = () => {
  return <div>Student Vanilla: TODO implement wrapper</div>
}
