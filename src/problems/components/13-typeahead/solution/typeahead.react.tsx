import { useCallback, useDeferredValue, useEffect, useRef, useState } from 'react'
import { Trie } from './trie'
import styles from './typeahead.module.css'
import flex from '@course/styles'
import cx from '@course/cx'

export type TTypeaheadEntry<T> = {
  query: string
  id: string
  value: T
}

type TTypeaheadProps<T> = {
  id?: string
  entries?: TTypeaheadEntry<T>[]
  onQuery: (query: string, signal?: AbortSignal) => Promise<TTypeaheadEntry<T>[]>
  itemRender: (item: TTypeaheadEntry<T>) => React.ReactNode
}

const DEFAULT_ITEM_RENDER = (item: TTypeaheadEntry<any>) => item.id
const DEFAULT_ENTRIES: TTypeaheadEntry<any>[] = []

export function Typeahead<T>({
  id = 'typeahead',
  entries = DEFAULT_ENTRIES,
  onQuery,
  itemRender = DEFAULT_ITEM_RENDER,
}: TTypeaheadProps<T>) {
  const trieRef = useRef<Trie<TTypeaheadEntry<T>>>(new Trie<TTypeaheadEntry<T>>())
  const containerRef = useRef<HTMLElement>(null)

  // Step 2: State & Helpers
  const [items, setItems] = useState<TTypeaheadEntry<T>[]>([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // useDeferredValue keeps the input extremely responsive.
  // React will re-render the input immediately, and fetch/filter results in the background.
  const deferredQuery = useDeferredValue(query)

  const updateTrie = useCallback(
    (entries: TTypeaheadEntry<T>[]) =>
      entries.forEach((entry) => {
        trieRef.current.insert(entry.query, entry)
      }),
    [],
  )

  const getVisibleItems = useCallback(() => {
    const trie = trieRef.current
    return trie.getWithPrefix(deferredQuery)
  }, [deferredQuery])

  const normalizedEntries = entries ?? DEFAULT_ENTRIES

  useEffect(() => {
    trieRef.current = new Trie<TTypeaheadEntry<T>>()
    updateTrie(normalizedEntries)
  }, [normalizedEntries, updateTrie])

  // Step 3 & 4: Async Fetching & Race Conditions
  useEffect(() => {
    // Show cached results immediately using the Trie
    setItems(getVisibleItems())
    setIsLoading(true)

    // AbortController prevents race conditions (older slower requests overwriting newer fast ones)
    const controller = new AbortController()

    onQuery(deferredQuery, controller.signal)
      .then((entries) => {
        updateTrie(entries)
        // Read items directly after trie mutation to avoid stale closure
        setItems(trieRef.current.getWithPrefix(deferredQuery))
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        console.error(error)
      })
      .finally(() => {
        if (controller.signal.aborted) return
        setIsLoading(false)
      })

    return () => {
      // Abort the previous fetch if deferredQuery changes before it completes
      controller.abort()
    }
  }, [deferredQuery, onQuery, updateTrie, getVisibleItems])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectItem = (item: TTypeaheadEntry<T>) => {
    setQuery(item.query)
    setItems([])
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleItemKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, item: TTypeaheadEntry<T>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      selectItem(item)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      // Focus back on input when escaping from an item
      const input = document.getElementById(id)
      if (input) input.focus()
    }
  }

  const showDropdown = isOpen && (items.length > 0 || isLoading)

  // Step 6: Rendering
  return (
    <section className={styles.container} ref={containerRef}>
      <div role="status" className={cx(styles.visuallyHidden, flex.pAbs)} aria-live="polite">
        {items.length} results available.
      </div>
      <input
        id={id}
        role="combobox"
        aria-label="Search"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-controls={`${id}-listbox`}
        className={flex.w100}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyDown}
      />
      {showDropdown && (
        <ul id={`${id}-listbox`} role="listbox" className={cx(styles.list, flex.bgWhite10, flex.shadow4, flex.padding8, flex.br4)}>
          {items.map((item) => (
            <li
              tabIndex={0}
              role="option"
              aria-selected={false}
              key={item.id}
              className={cx(styles.item, flex.padding4)}
              onClick={() => selectItem(item)}
              onKeyDown={(e) => handleItemKeyDown(e, item)}
            >
              {itemRender(item)}
            </li>
          ))}
          {isLoading && (
            <li role="status" className={cx(styles.item, flex.padding4, flex.cBlack4)}>
              Loading...
            </li>
          )}
          {!isLoading && items.length === 0 && query.length > 0 && (
            <li className={cx(styles.item, flex.padding4, flex.cBlack4)}>
              No results found
            </li>
          )}
        </ul>
      )}
    </section>
  )
}
