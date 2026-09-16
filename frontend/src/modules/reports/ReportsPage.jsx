import { useEffect, useState } from 'react';
import { api } from '../../shared/api';
import { EmptyState, LoadingState } from '../../shared/ui';

const ReportsPage = () => {
  const [period, setPeriod] = useState('day');
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [grossProfit, setGrossProfit] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [salesRes, topRes, profitRes] = await Promise.all([
      api.get('/reports/sales', { params: { period } }),
      api.get('/reports/top-products'),
      api.get('/reports/gross-profit', { params: { period: period === 'day' ? 'month' : period } }),
    ]);
    setSales(salesRes.data);
    setTopProducts(topRes.data);
    setGrossProfit(profitRes.data);
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [period]);

  const exportCsv = async () => {
    const response = await api.get('/reports/sales/export/csv', { params: { period }, responseType: 'blob' });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'laporan-penjualan.csv';
    link.click();
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-4">
      <div className="card flex items-center gap-2">
        <select className="input max-w-[180px]" value={period} onChange={(event) => setPeriod(event.target.value)}>
          <option value="day">Harian</option>
          <option value="month">Bulanan</option>
          <option value="year">Tahunan</option>
        </select>
        <button className="btn btn-primary" onClick={exportCsv}>Export CSV</button>
      </div>

      <div className="card">
        <h2 className="mb-2 font-semibold">Laporan Penjualan</h2>
        {!sales.length ? <EmptyState title="Data penjualan kosong" /> : sales.map((item) => (
          <div key={item.periodLabel} className="flex items-center justify-between border-b border-slate-200 py-2 text-sm last:border-0 dark:border-slate-800">
            <span>{item.periodLabel} • {item.totalTransactions} transaksi</span>
            <span>Rp {Number(item.totalSales).toLocaleString('id-ID')}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="mb-2 font-semibold">Produk Terlaris</h2>
        {!topProducts.length ? <EmptyState title="Belum ada data" /> : topProducts.slice(0, 10).map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-slate-200 py-2 text-sm last:border-0 dark:border-slate-800">
            <span>{item.name}</span>
            <span>{item.totalSold}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="mb-2 font-semibold">Laba Kotor</h2>
        {!grossProfit.length ? <EmptyState title="Belum ada data" /> : grossProfit.map((item) => (
          <div key={item.periodLabel} className="flex items-center justify-between border-b border-slate-200 py-2 text-sm last:border-0 dark:border-slate-800">
            <span>{item.periodLabel}</span>
            <span>Rp {Number(item.grossProfit).toLocaleString('id-ID')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
