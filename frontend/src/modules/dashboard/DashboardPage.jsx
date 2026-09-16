import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../../shared/api';
import { EmptyState, LoadingState } from '../../shared/ui';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/dashboard/summary');
        setData(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingState />;
  if (!data) return <EmptyState title="Dashboard belum tersedia" />;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="card">
          <p className="text-sm text-slate-500">Total Penjualan Hari Ini</p>
          <p className="text-2xl font-bold">Rp {Number(data.totalToday).toLocaleString('id-ID')}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Total Penjualan Bulan Ini</p>
          <p className="text-2xl font-bold">Rp {Number(data.totalMonth).toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-3 font-semibold">Grafik Penjualan Harian</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chart.daily}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-3 font-semibold">Produk Hampir Habis</h2>
        {!data.lowStock.length ? (
          <EmptyState title="Semua stok aman" />
        ) : (
          <div className="space-y-2 text-sm">
            {data.lowStock.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded border border-slate-200 p-2 dark:border-slate-800">
                <span>{item.name}</span>
                <span>{item.stock} / min {item.minStock}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
