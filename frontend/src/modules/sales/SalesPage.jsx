import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../shared/api';
import { EmptyState, LoadingState } from '../../shared/ui';

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products', { params: { page: 1, pageSize: 100 } })
      .then((response) => setProducts(response.data.data))
      .finally(() => setLoading(false));
  }, []);

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const total = Math.max(subtotal - discount, 0);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product.id, name: product.name, price: Number(product.sellPrice), quantity: 1 }];
    });
  };

  const submitSale = async () => {
    if (!cart.length) return toast.error('Keranjang kosong');
    const payload = {
      items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      discount,
      paymentMethod,
      paidAmount,
    };
    const response = await api.post('/sales', payload);
    setReceipt(response.data.printableReceipt);
    setCart([]);
    setDiscount(0);
    setPaidAmount(0);
    toast.success('Transaksi berhasil');
  };

  if (loading) return <LoadingState />;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card space-y-2">
        <h2 className="font-semibold">Produk</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {products.map((item) => (
            <button key={item.id} className="rounded border border-slate-200 p-2 text-left text-sm dark:border-slate-800" onClick={() => addToCart(item)}>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-slate-500">Rp {Number(item.sellPrice).toLocaleString('id-ID')} • stok {item.stock}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="card space-y-3">
        <h2 className="font-semibold">Keranjang</h2>
        {!cart.length ? <EmptyState title="Belum ada item" /> : cart.map((item) => (
          <div key={item.productId} className="flex items-center justify-between text-sm">
            <span>{item.name} x{item.quantity}</span>
            <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
          </div>
        ))}
        <input className="input" type="number" placeholder="Diskon" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} />
        <select className="input" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
          <option value="cash">Cash</option>
          <option value="qris">QRIS</option>
          <option value="transfer">Transfer</option>
        </select>
        <input className="input" type="number" placeholder="Uang dibayar" value={paidAmount} onChange={(event) => setPaidAmount(Number(event.target.value))} />
        <p className="font-semibold">Total: Rp {total.toLocaleString('id-ID')}</p>
        <button className="btn btn-primary w-full" onClick={submitSale}>Bayar</button>

        {receipt && (
          <div className="rounded border border-dashed border-slate-300 p-3 text-sm dark:border-slate-700">
            <p className="font-semibold">Struk #{receipt.invoiceNo}</p>
            {receipt.items.map((item) => <p key={item.productId}>{item.productId} x{item.quantity} = Rp {item.lineTotal.toLocaleString('id-ID')}</p>)}
            <p>Total: Rp {receipt.total.toLocaleString('id-ID')}</p>
            <button className="btn btn-muted mt-2" onClick={() => window.print()}>Cetak Struk</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPage;
