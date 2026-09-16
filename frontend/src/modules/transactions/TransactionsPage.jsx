import { useEffect, useState } from 'react';
import { api } from '../../shared/api';
import { EmptyState, LoadingState } from '../../shared/ui';

const TransactionsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchData = async () => {
    const response = await api.get('/sales', { params: { from, to } });
    setRows(response.data.data);
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  const exportCsv = async () => {
    const response = await api.get('/sales/export/csv', { params: { from, to }, responseType: 'blob' });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'riwayat-transaksi.csv';
    link.click();
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap gap-2">
        <input className="input max-w-[180px]" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        <input className="input max-w-[180px]" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        <button className="btn btn-muted" onClick={fetchData}>Filter</button>
        <button className="btn btn-primary" onClick={exportCsv}>Export CSV</button>
      </div>

      <div className="card">
        {!rows.length ? <EmptyState title="Belum ada transaksi" /> : (
          <div className="space-y-2 text-sm">
            {rows.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded border border-slate-200 p-2 dark:border-slate-800">
                <span>{item.invoiceNo} • {item.cashierName}</span>
                <span>Rp {Number(item.total).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
