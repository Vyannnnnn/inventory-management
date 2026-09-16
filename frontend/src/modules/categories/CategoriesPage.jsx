import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../shared/api';
import { EmptyState, LoadingState } from '../../shared/ui';

const CategoriesPage = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await api.get('/categories');
    setItems(response.data);
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!name.trim()) return toast.error('Nama kategori wajib diisi');
    await api.post('/categories', { name, description });
    setName('');
    setDescription('');
    toast.success('Kategori ditambahkan');
    fetchData();
  };

  const remove = async (id) => {
    await api.delete(`/categories/${id}`);
    toast.success('Kategori dihapus');
    fetchData();
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-4">
      <div className="card grid gap-2 md:grid-cols-3">
        <input className="input" placeholder="Nama kategori" value={name} onChange={(event) => setName(event.target.value)} />
        <input className="input" placeholder="Deskripsi" value={description} onChange={(event) => setDescription(event.target.value)} />
        <button className="btn btn-primary" onClick={submit}>Tambah</button>
      </div>
      <div className="card">
        {!items.length ? (
          <EmptyState title="Belum ada kategori" />
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded border border-slate-200 p-2 dark:border-slate-800">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.description || '-'}</p>
                </div>
                <button className="btn btn-muted" onClick={() => remove(item.id)}>Hapus</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
