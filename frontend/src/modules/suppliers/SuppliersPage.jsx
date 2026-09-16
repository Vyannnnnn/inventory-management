import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../shared/api';
import { EmptyState, LoadingState } from '../../shared/ui';

const SuppliersPage = () => {
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await api.get('/suppliers');
    setItems(response.data);
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!form.name.trim()) return toast.error('Nama supplier wajib diisi');
    await api.post('/suppliers', form);
    setForm({ name: '', phone: '', email: '', address: '' });
    toast.success('Supplier ditambahkan');
    fetchData();
  };

  const showHistory = async (id) => {
    const response = await api.get(`/suppliers/${id}/purchases`);
    setHistory(response.data);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-4">
      <div className="card grid gap-2 md:grid-cols-5">
        <input className="input" placeholder="Nama" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
        <input className="input" placeholder="Phone" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />
        <input className="input" placeholder="Email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
        <input className="input" placeholder="Alamat" value={form.address} onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))} />
        <button className="btn btn-primary" onClick={submit}>Tambah</button>
      </div>

      <div className="card space-y-2">
        {!items.length ? (
          <EmptyState title="Belum ada supplier" />
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded border border-slate-200 p-2 dark:border-slate-800">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-slate-500">{item.phone || '-'} • {item.email || '-'}</p>
              </div>
              <button className="btn btn-muted" onClick={() => showHistory(item.id)}>Riwayat Pembelian</button>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h2 className="mb-2 font-semibold">Riwayat Pembelian Supplier</h2>
        {!history.length ? <EmptyState title="Pilih supplier untuk melihat riwayat" /> : (
          <div className="space-y-2 text-sm">
            {history.map((item) => (
              <div key={item.id} className="rounded border border-slate-200 p-2 dark:border-slate-800">
                <p>{item.product_name} • Qty {item.quantity}</p>
                <p className="text-xs text-slate-500">Biaya total Rp {Number(item.total_cost).toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuppliersPage;
