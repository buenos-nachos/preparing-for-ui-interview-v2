export type Stock = {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    marketCap: string;
    peRatio: number;
};

const MOCK_DATA: Stock[] = [
    { id: '1', symbol: 'AAPL', name: 'Apple Inc.', price: 150.00, change: 1.50, changePercent: 1.01, volume: '100M', marketCap: '2.5T', peRatio: 25.5 },
    { id: '2', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2800.00, change: -15.00, changePercent: -0.53, volume: '1.5M', marketCap: '1.9T', peRatio: 28.1 },
    { id: '3', symbol: 'MSFT', name: 'Microsoft Corp.', price: 300.00, change: 2.00, changePercent: 0.67, volume: '25M', marketCap: '2.3T', peRatio: 35.2 },
    { id: '4', symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3400.00, change: 10.00, changePercent: 0.29, volume: '3M', marketCap: '1.7T', peRatio: 60.5 },
    { id: '5', symbol: 'TSLA', name: 'Tesla Inc.', price: 750.00, change: -5.00, changePercent: -0.66, volume: '20M', marketCap: '750B', peRatio: 120.0 },
    { id: '6', symbol: 'FB', name: 'Meta Platforms', price: 330.00, change: 3.00, changePercent: 0.92, volume: '15M', marketCap: '900B', peRatio: 24.0 },
    { id: '7', symbol: 'NVDA', name: 'NVIDIA Corp.', price: 220.00, change: 4.00, changePercent: 1.85, volume: '40M', marketCap: '550B', peRatio: 75.0 },
    { id: '8', symbol: 'JPM', name: 'JPMorgan Chase', price: 160.00, change: 0.50, changePercent: 0.31, volume: '10M', marketCap: '480B', peRatio: 11.5 },
    { id: '9', symbol: 'V', name: 'Visa Inc.', price: 230.00, change: 1.20, changePercent: 0.52, volume: '8M', marketCap: '450B', peRatio: 35.0 },
    { id: '10', symbol: 'JNJ', name: 'Johnson & Johnson', price: 170.00, change: 0.80, changePercent: 0.47, volume: '6M', marketCap: '440B', peRatio: 24.5 },
    { id: '11', symbol: 'WMT', name: 'Walmart Inc.', price: 140.00, change: -0.50, changePercent: -0.36, volume: '9M', marketCap: '390B', peRatio: 40.0 },
    { id: '12', symbol: 'PG', name: 'Procter & Gamble', price: 145.00, change: 0.20, changePercent: 0.14, volume: '7M', marketCap: '350B', peRatio: 26.0 },
    { id: '13', symbol: 'MA', name: 'Mastercard Inc.', price: 350.00, change: 2.50, changePercent: 0.72, volume: '4M', marketCap: '340B', peRatio: 45.0 },
    { id: '14', symbol: 'UNH', name: 'UnitedHealth Group', price: 480.00, change: 5.00, changePercent: 1.05, volume: '3M', marketCap: '450B', peRatio: 22.0 },
    { id: '15', symbol: 'HD', name: 'Home Depot', price: 320.00, change: -2.00, changePercent: -0.62, volume: '5M', marketCap: '330B', peRatio: 20.0 },
    { id: '16', symbol: 'BAC', name: 'Bank of America', price: 45.00, change: 0.10, changePercent: 0.22, volume: '45M', marketCap: '380B', peRatio: 12.0 },
    { id: '17', symbol: 'DIS', name: 'Walt Disney Co.', price: 155.00, change: -1.00, changePercent: -0.64, volume: '12M', marketCap: '280B', peRatio: 30.0 },
    { id: '18', symbol: 'ADBE', name: 'Adobe Inc.', price: 550.00, change: 6.00, changePercent: 1.10, volume: '2M', marketCap: '260B', peRatio: 45.0 },
    { id: '19', symbol: 'NFLX', name: 'Netflix Inc.', price: 600.00, change: 8.00, changePercent: 1.35, volume: '4M', marketCap: '270B', peRatio: 55.0 },
    { id: '20', symbol: 'CRM', name: 'Salesforce.com', price: 250.00, change: 3.50, changePercent: 1.42, volume: '6M', marketCap: '240B', peRatio: 48.0 },
];

export type TPaginatedAPIResponse<T> = {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export function fetchStocks(page: number = 0, pageSize: number = 5): Promise<TPaginatedAPIResponse<Stock>> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const start = page * pageSize;
            const end = start + pageSize;

            // Generate dynamic data based on the static templates
            const data = MOCK_DATA.slice(start, end).map(stock => {
                const volatility = 0.05; // 5% volatility
                const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
                const newPrice = stock.price * randomFactor;
                const change = newPrice - stock.price; // Change relative to the "base" price
                const changePercent = (change / stock.price) * 100;

                return {
                    ...stock,
                    price: parseFloat(newPrice.toFixed(2)),
                    change: parseFloat(change.toFixed(2)),
                    changePercent: parseFloat(changePercent.toFixed(2)),
                    volume: Math.floor(Math.random() * 100 + 1) + 'M'
                };
            });

            resolve({
                data,
                total: MOCK_DATA.length,
                page,
                pageSize,
                totalPages: Math.ceil(MOCK_DATA.length / pageSize)
            });
        }, 500);
    });
}
