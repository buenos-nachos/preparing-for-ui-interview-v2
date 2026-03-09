import React, { useEffect, useMemo, useState } from 'react'
import styles from './table.module.css'
import flex from '@course/styles'
import cx from '@course/cx'

export interface TTableDataSource<T> {
  pageSize: number
  pages: number
  next: (page: number, pageSize: number) => Promise<T[]>
}
export type TTableColumn<T> = {
  id: string
  name: string
  renderer: (item: T) => React.ReactNode
  sort?: 'asc' | 'desc' | 'none'
}

type TTableProps<T extends { id: string }> = {
  columns: TTableColumn<T>[]
  datasource: TTableDataSource<T>
  search?: (query: string, data: T[]) => T[]
  comparator?: (columnId: keyof T, direction: 'asc' | 'desc') => (a: T, b: T) => number
}

const nextDir = { none: 'asc', asc: 'desc', desc: 'none' } as const

export function Table<T extends { id: string }>({
  search,
  columns,
  datasource,
  comparator,
}: TTableProps<T>) {
  const [query, setQuery] = useState('')
  const [data, setData] = useState<T[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [sort, setSort] = useState<{
    columnId: keyof T
    direction: 'asc' | 'desc' | 'none'
  } | null>(null)

  useEffect(() => {
    setData([])
    setCurrentPage(0)
    datasource.next(0, datasource.pageSize).then(setData)
  }, [datasource])

  const next = () => {
    if (currentPage >= datasource.pages - 1) return
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    if (data.length <= nextPage * datasource.pageSize) {
      datasource.next(nextPage, datasource.pageSize).then((d) => setData((prev) => [...prev, ...d]))
    }
  }

  const prev = () => setCurrentPage((p) => Math.max(p - 1, 0))

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setCurrentPage(0)
  }

  const onSort: React.MouseEventHandler<HTMLTableSectionElement> = ({ target }) => {
    if (!(target instanceof HTMLElement) || !target.dataset.columnId) return
    const columnId = target.dataset.columnId as keyof T
    const column = columns.find((c) => c.id === columnId)
    if (!column) return
    setSort((prev) => {
      const dir = prev?.columnId === columnId ? prev.direction : (column.sort ?? 'none')
      return { columnId, direction: nextDir[dir] }
    })
  }

  const slice = useMemo(() => {
    const filtered = query
      ? (search ? search(query, data) : data.filter((item) => item.id.includes(query)))
      : data
    const sorted =
      sort && comparator && sort.direction !== 'none'
        ? [...filtered].sort(comparator(sort.columnId as keyof T, sort.direction))
        : filtered
    const start = currentPage * datasource.pageSize
    return sorted.slice(start, start + datasource.pageSize)
  }, [data, query, search, sort, comparator, currentPage, datasource])

  return (
    <div className={cx(flex.w100, flex.flexColumnStart)}>
      <table>
        <thead onClickCapture={onSort}>
          <tr>
            {columns.map((c) => {
              const currentSort = sort?.columnId === c.id ? sort.direction : c.sort
              return (
                <th data-column-id={c.id} className={cx(flex.padding8)} key={c.id}>
                  {c.name}
                  {currentSort === 'asc' ? ' ↑' : currentSort === 'desc' ? ' ↓' : ''}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {slice.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col.id} className={cx(flex.padding8)}>
                  {col.renderer(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={cx(flex.flexRowCenter, flex.flexGap8, styles.controls)}>
        <button disabled={currentPage === 0} className={cx(flex.paddingHor8)} onClick={prev}>
          Prev
        </button>
        <span>
          {currentPage + 1} / {datasource.pages}
        </span>
        <button
          disabled={currentPage === datasource.pages - 1}
          className={cx(flex.paddingHor8)}
          onClick={next}
        >
          Next
        </button>
        <input type="search" placeholder="Filter" onChange={onSearch} />
      </div>
    </div>
  )
}
