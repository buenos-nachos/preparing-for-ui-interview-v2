import { Component, type TComponentConfig } from "../abstract-component/component";
import styles from './table.module.css';
import flex from '@course/styles';
import cx from '@course/cx';

export type TTableColumn<T> = {
    id: string;
    name: string;
    renderer: (item: T) => string;
    sort?: 'asc' | 'desc' | 'none';
};

export type TTableProps<T> = {
    columns: TTableColumn<T>[];
    data: T[];
    currentPage: number;
    totalPages: number;
    onNext?: () => void;
    onPrev?: () => void;
    onSearch?: (query: string) => void;
    onSort?: (columnId: keyof T, direction: 'asc' | 'desc' | 'none') => void;
};

export class Table<T extends { id: string }> extends Component<TTableProps<T>> {
    private tbody: HTMLTableSectionElement | null = null;
    private prevBtn: HTMLButtonElement | null = null;
    private nextBtn: HTMLButtonElement | null = null;
    private pageInfo: HTMLSpanElement | null = null;

    constructor(config: TComponentConfig<TTableProps<T>>) {
        super({
            ...config,
            className: [styles.table, ...(config.className || [])],
            listeners: ['click', 'input', ...(config.listeners || [])]
        });
    }

    onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;

        // Handle Sort
        const th = target.closest('th');
        if (th && th.dataset.columnId) {
            const columnId = th.dataset.columnId;
            const column = this.config.columns.find(c => c.id === columnId);
            if (column && this.config.onSort) {
                const newDirection = column.sort === 'desc' ? 'none' : column.sort === 'asc' ? 'desc' : 'asc';
                this.config.onSort(columnId as keyof T, newDirection);
            }
            return;
        }

        // Handle Pagination
        if (target.matches('button')) {
            if (target.textContent === 'Prev' && this.config.onPrev) {
                this.config.onPrev();
            } else if (target.textContent === 'Next' && this.config.onNext) {
                this.config.onNext();
            }
        }
    }

    onInput(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.type === 'search' && this.config.onSearch) {
            this.config.onSearch(target.value);
        }
    }

    update(newConfig: Partial<TTableProps<T>>) {
        this.config = { ...this.config, ...newConfig };
        this.renderRows();
        this.renderPagination();
        this.updateHeaderSortIcons();
    }

    private renderRows() {
        if (!this.tbody) return;
        const { columns, data } = this.config;
        this.tbody.innerHTML = data.map(item => `
            <tr>
                ${columns.map(col => `
                    <td class="${cx(flex.padding8)}">${col.renderer(item)}</td>
                `).join('')}
            </tr>
        `).join('');
    }

    private renderPagination() {
        if (!this.prevBtn || !this.nextBtn || !this.pageInfo) return;
        const { currentPage, totalPages } = this.config;

        this.prevBtn.disabled = currentPage === 0;
        this.nextBtn.disabled = currentPage === totalPages - 1;
        this.pageInfo.textContent = `${currentPage + 1} / ${totalPages}`;
    }

    private updateHeaderSortIcons() {
        if (!this.container) return;
        const headers = this.container.querySelectorAll('th');
        headers.forEach(th => {
            const columnId = th.dataset.columnId;
            const column = this.config.columns.find(c => c.id === columnId);
            if (column) {
                // Keep the text content but update the arrow
                // We assumption: Name is text node, arrow is text node.
                // Simpler: re-render the whole header content
                th.textContent = `${column.name}${column.sort === 'asc' ? ' ↑' : column.sort === 'desc' ? ' ↓' : ''}`;
            }
        });
    }

    afterRender() {
        super.afterRender();
        this.tbody = this.container!.querySelector('tbody');
        this.prevBtn = this.container!.querySelector('button:first-of-type');
        this.nextBtn = this.container!.querySelector('button:last-of-type');
        this.pageInfo = this.container!.querySelector('span');
    }

    toHTML(): string {
        const { columns, data, currentPage, totalPages } = this.config;

        return `
            <table>
                <thead>
                    <tr>
                        ${columns.map(c => `
                            <th data-column-id="${c.id}" class="${cx(flex.padding8)}" style="cursor: pointer;">
                                ${c.name}${c.sort === 'asc' ? ' ↑' : c.sort === 'desc' ? ' ↓' : ''}
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(item => `
                        <tr>
                            ${columns.map(col => `
                                <td class="${cx(flex.padding8)}">${col.renderer(item)}</td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="${cx(flex.flexRowCenter, flex.flexGap8)}">
                <button ${currentPage === 0 ? 'disabled' : ''} class="${cx(flex.paddingHor8)}">Prev</button>
                <span>${currentPage + 1} / ${totalPages}</span>
                <button ${currentPage === totalPages - 1 ? 'disabled' : ''} class="${cx(flex.paddingHor8)}">Next</button>
                <input type="search" placeholder="Filter" />
            </div>
        `;
    }
}
