import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../modules/auth/AuthContext';

const menus = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Produk' },
  { to: '/categories', label: 'Kategori' },
  { to: '/suppliers', label: 'Supplier' },
  { to: '/sales', label: 'POS' },
  { to: '/transactions', label: 'Riwayat' },
  { to: '/reports', label: 'Laporan' },
];

const AppLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-6 text-lg font-bold">Sistem Toko</h1>
        <nav className="space-y-1">
          {menus.map((menu) => (
            <NavLink
              key={menu.to}
              to={menu.to}
              end={menu.to === '/'}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-primary-100 text-primary-700 dark:bg-slate-800 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`
              }
            >
              {menu.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs uppercase text-slate-500">{user?.role}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-muted" onClick={() => setDark((value) => !value)}>{dark ? 'Light' : 'Dark'}</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
            >
              Logout
            </button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
