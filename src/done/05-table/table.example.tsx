import { useState, useRef, useDeferredValue, useEffect, useMemo, useEffectEvent } from "react";
import { Table, type TTableColumn } from "./table.react";
import { Table as VanillaTable, type TTableColumn as TVanillaTableColumn } from "./table.vanila";
import { fetchStocks, type TPaginatedAPIResponse, type Stock } from './api';

const COLUMNS: TTableColumn<Stock>[] = [
    { id: 'symbol', name: 'Symbol', renderer: (s) => s.symbol },
    { id: 'name', name: 'Name', renderer: (s) => s.name },
    { id: 'price', name: 'Price', renderer: (s) => `$${s.price.toFixed(2)}` },
    { id: 'change', name: 'Change', renderer: (s) => <span style={{ color: s.change >= 0 ? 'green' : 'red' }}>{s.change > 0 ? '+' : ''}{s.change.toFixed(2)}</span> },
    { id: 'changePercent', name: '% Change', renderer: (s) => <span style={{ color: s.changePercent >= 0 ? 'green' : 'red' }}>{s.changePercent.toFixed(2)}%</span> },
    { id: 'volume', name: 'Volume', renderer: (s) => s.volume.toString() },
    { id: 'marketCap', name: 'Market Cap', renderer: (s) => s.marketCap.toString() },
    { id: 'peRatio', name: 'P/E Ratio', renderer: (s) => s.peRatio.toString() },
];

const VANILLA_COLUMNS: TVanillaTableColumn<Stock>[] = [
    { id: 'symbol', name: 'Symbol', renderer: (s) => s.symbol },
    { id: 'name', name: 'Name', renderer: (s) => s.name },
    { id: 'price', name: 'Price', renderer: (s) => `$${s.price.toFixed(2)}` },
    { id: 'change', name: 'Change', renderer: (s) => `<span style="color: ${s.change >= 0 ? 'green' : 'red'}">${s.change > 0 ? '+' : ''}${s.change.toFixed(2)}</span>` },
    { id: 'changePercent', name: '% Change', renderer: (s) => `<span style="color: ${s.changePercent >= 0 ? 'green' : 'red'}">${s.changePercent.toFixed(2)}%</span>` },
    { id: 'volume', name: 'Volume', renderer: (s) => s.volume.toString() },
    { id: 'marketCap', name: 'Market Cap', renderer: (s) => s.marketCap.toString() },
    { id: 'peRatio', name: 'P/E Ratio', renderer: (s) => s.peRatio.toString() },
];

const defaultComparator = (columnId: keyof Stock, direction: 'asc' | 'desc') => (a: Stock, b: Stock): number => {
    const modifier = direction === 'asc' ? 1 : -1;
    if (typeof a[columnId] === 'string' && typeof b[columnId] === 'string') {
        return a[columnId].localeCompare(b[columnId]) * modifier;
    }
    if (typeof a[columnId] === 'number' && typeof b[columnId] === 'number') {
        return (a[columnId] - b[columnId]) * modifier;
    }
    return 0;
}

function useStockTable<TCol extends { id: string, sort?: 'asc' | 'desc' | 'none' }>(initialColumns: TCol[]) {
    const [columns, setColumns] = useState(initialColumns);
    const [data, setData] = useState<TPaginatedAPIResponse<Stock>>({ data: [], total: 0, page: 0, pageSize: 0, totalPages: 0 });
    const [page, setPage] = useState(0);
    const [query, setQuery] = useState('');
    const defferedQuery = useDeferredValue(query);

    const intervalID = useRef<Timer | undefined>(undefined);

    const fetch = useEffectEvent(() => {
        fetchStocks(page).then(setData)
    });

    useEffect(() => {
        window.clearInterval(intervalID.current);
        fetch();
        intervalID.current = setInterval(fetch, 5000);
        return () => window.clearInterval(intervalID.current);
    }, [page]);

    const setSortedColumn = (columnId: keyof Stock, direction: 'asc' | 'desc' | 'none') => {
        setColumns((prev) => {
            return prev.map((c) => {
                if (c.id === columnId) {
                    return { ...c, sort: direction };
                }
                return { ...c, sort: 'none' };
            });
        });
    };

    const rows = data.data;

    const filteredData = useMemo(() => {
        return !defferedQuery ? rows : rows.filter((d) => Object.values(d).some(v => v.toString().toLowerCase().includes(defferedQuery.toLowerCase())));
    }, [data, defferedQuery]);

    const sortedData = useMemo(() => {
        const sortedColumn = columns.find((c) => c.sort !== 'none' && c.sort !== undefined);
        if (!sortedColumn || !sortedColumn.sort || sortedColumn.sort === 'none') return filteredData;
        return [...filteredData].sort(defaultComparator(sortedColumn.id as keyof Stock, sortedColumn.sort));
    }, [filteredData, columns]);

    return {
        columns,
        data: sortedData,
        page,
        setPage,
        setQuery,
        setSortedColumn,
        totalPages: data.totalPages,
        query
    };
}

export function TableExample() {
    const { columns, data, page, setPage, setQuery, setSortedColumn, totalPages } = useStockTable(COLUMNS);

    return <Table
        columns={columns}
        data={data}
        next={() => setPage(p => p + 1)}
        prev={() => setPage(p => Math.max(0, p - 1))}
        sort={setSortedColumn}
        search={setQuery}
        currentPage={page}
        totalPages={totalPages}
    />
}

export function TableVanillaExample() {
    const { columns, data, page, setPage, setQuery, setSortedColumn, totalPages } = useStockTable(VANILLA_COLUMNS);
    const rootRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<VanillaTable<Stock> | null>(null);

    useEffect(() => {
        if (!rootRef.current) return;
        tableRef.current = new VanillaTable({
            root: rootRef.current,
            columns,
            data,
            currentPage: page,
            totalPages,
            onNext: () => setPage(p => p + 1),
            onPrev: () => setPage(p => Math.max(0, p - 1)),
            onSearch: (q) => setQuery(q),
            onSort: (id, dir) => setSortedColumn(id, dir)
        });
        tableRef.current.render();
        return () => {
            tableRef.current?.destroy();
            tableRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.update({
                columns,
                data,
                currentPage: page,
                totalPages
            });
        }
    }, [columns, data, page, totalPages]);

    return <div ref={rootRef}></div>;
}
