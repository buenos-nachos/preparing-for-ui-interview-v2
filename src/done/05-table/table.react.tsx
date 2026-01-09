import React, { type ChangeEventHandler } from 'react';
import styles from './table.module.css';
import flex from '@course/styles'
import cx from '@course/cx';


export type TTableColumn<T> = {
    id: string,
    name: string,
    renderer: (item: T) => React.ReactNode
    sort?: 'asc' | 'desc' | 'none'
}

type TTableProps<T> = {
    columns: TTableColumn<T>[],
    data: T[],
    next: () => void,
    prev: () => void,
    search: (query: string) => void,
    sort: (columnId: keyof T, direction: 'asc' | 'desc' | 'none') => void
    currentPage: number,
    totalPages: number
}


export function Table<T extends { id: string }>({ columns, data, next, prev, search, sort, currentPage, totalPages }: TTableProps<T>) {

    const onSearch: ChangeEventHandler<HTMLInputElement> = ({ target }) => search(target.value);

    const onSort: React.MouseEventHandler<HTMLTableSectionElement> = ({ target }) => {
        if (!(target instanceof HTMLElement) || !target.dataset.columnId) return;
        const columnId = target.dataset.columnId as keyof T;
        const column = columns.find((c) => c.id === columnId);
        if (!column) return;
        const newDirection = column.sort === 'desc' ? 'none' : column.sort === 'asc' ? 'desc' : 'asc';
        sort(columnId, newDirection);
    };

    return (
        <div className={styles.table}>
            <table>
                <thead onClickCapture={onSort}>
                    <tr>
                        {columns.map((c) => (
                            <th data-column-id={c.id} className={cx(flex.padding8)} key={c.id}>
                                {c.name}
                                {c.sort === 'asc' ? ' ↑' : c.sort === 'desc' ? ' ↓' : ''}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => <tr key={item.id}>
                        {columns.map((col) => <td key={col.id} className={cx(flex.padding8)} >{col.renderer(item)}</td>)}
                    </tr>)}
                </tbody>
            </table>
            <div className={cx(flex.flexRowCenter, flex.flexGap8)}>
                <button disabled={currentPage === 0} className={cx(flex.paddingHor8)} onClick={prev}>Prev</button>
                <span>{currentPage + 1} / {totalPages}</span>
                <button disabled={currentPage === totalPages - 1} className={cx(flex.paddingHor8)} onClick={next}>Next</button>
                <input type="search" placeholder="Filter" onChange={onSearch} />
            </div>
        </div>
    );
}






