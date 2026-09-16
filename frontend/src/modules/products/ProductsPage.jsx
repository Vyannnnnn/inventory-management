import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../shared/api';
import { EmptyState, LoadingState } from '../../shared/ui';

const initialForm = {
  name: '',
  categoryId: '',
  supplierId: '',
  buyPrice: 0,
  sellPrice: 0,
  stock: 0,
  minStock: 0,
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [productRes, catRes, supplierRes] = await Promise.all([
      api.get('/products', { params: { page, search } }),
      api.get('/categories'),
      api.get('/suppliers'),
    ]);
    setProducts(productRes.data.data);
    setPagination(productRes.data.pagination);
    setCategories(catRes.data);
    setSuppliers(supplierRes.data);
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [page]);

  const submit = async () => {
    if (!form.name.trim()) return toast.error('Nama produk wajib diisi');
    await api.post('/products', {
      ...form,
      categoryId: form.categoryId || null,
      supplierId: form.supplierId || null,
    });
    toast.success('Produk ditambahkan');
    setForm(initialForm);
    fetchData();
  };

  const remove = async (id) => {
    await api.delete(`/products/${id}`);
    toast.success('Produk dihapus');
    fetchData();
  };

  const runSearch = () => {
    setPage(1);
    fetchData();
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-4">
      <div className="card grid gap-2 md:grid-cols-4">
        <input className="input" placeholder="Nama produk" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
        <select className="input" value={form.categoryId} onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}>
          <option value="">Pilih kategori</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select className="input" value={form.supplierId} onChange={(event) => setForm((prev) => ({ ...prev, supplierId: event.target.value }))}>
          <option value="">Pilih supplier</option>
          {suppliers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <input className="input" type="number" placeholder="Harga beli" value={form.buyPrice} onChange={(event) => setForm((prev) => ({ ...prev, buyPrice: Number(event.target.value) }))} />
        <input className="input" type="number" placeholder="Harga jual" value={form.sellPrice} onChange={(event) => setForm((prev) => ({ ...prev, sellPrice: Number(event.target.value) }))} />
        <input className="input" type="number" placeholder="Stok" value={form.stock} onChange={(event) => setForm((prev) => ({ ...prev, stock: Number(event.target.value) }))} />
        <input className="input" type="number" placeholder="Minimum stok" value={form.minStock} onChange={(event) => setForm((prev) => ({ ...prev, minStock: Number(event.target.value) }))} />
        <button className="btn btn-primary" onClick={submit}>Tambah</button>
      </div>

      <div className="card">
        <div className="mb-3 flex gap-2">
          <input className="input" placeholder="Search produk" value={search} onChange={(event) => setSearch(event.target.value)} />
          <button className="btn btn-muted" onClick={runSearch}>Cari</button>
        </div>

        {!products.length ? (
          <EmptyState title="Belum ada produk" />
        ) : (
          <div className="space-y-2 text-sm">
            {products.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded border border-slate-200 p-2 dark:border-slate-800">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.categoryName || '-'} • Stok: {item.stock}</p>
                </div>
                <button className="btn btn-muted" onClick={() => remove(item.id)}>Hapus</button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span>Total: {pagination.total}</span>
          <div className="flex gap-2">
            <button className="btn btn-muted" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>Prev</button>
            <button className="btn btn-muted" disabled={page * pagination.pageSize >= pagination.total} onClick={() => setPage((prev) => prev + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
