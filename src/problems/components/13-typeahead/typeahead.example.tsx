import { Typeahead } from './solution/typeahead.react'
import { Typeahead as TypeaheadStudent } from './typeahead.react'
import { Typeahead as VanillaTypeahead } from './solution/typeahead.vanila'
import { useEffect, useRef } from 'react'

const handleQuery = async (query: string, signal?: AbortSignal) => {
  if (!query) return []
  try {
    const response = await fetch(`/api/typeahead?query=${encodeURIComponent(query)}`, { signal })
    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error: any) {
    if (error.name === 'AbortError') return []
    console.error('Fetch error:', error)
    return []
  }
}

export const TypeaheadExample = () => {
  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <Typeahead<string>
        entries={[]}
        onQuery={handleQuery}
        itemRender={(item) => <span>{item.value}</span>}
      />
    </div>
  )
}

export const TypeaheadVanillaExample = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<VanillaTypeahead | null>(null)

  useEffect(() => {
    if (!rootRef.current) return
    instanceRef.current = new VanillaTypeahead({
      root: rootRef.current,
      onQuery: handleQuery,
      itemRender: (item) => item.value,
    })
    instanceRef.current.render()

    return () => {
      instanceRef.current?.destroy()
      instanceRef.current = null
    }
  }, [])

  return <div ref={rootRef} style={{ padding: 20, maxWidth: 400 }} />
}
export const TypeaheadStudentExample = () => {
  return <TypeaheadStudent />
}
