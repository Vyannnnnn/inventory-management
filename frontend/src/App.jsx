import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './modules/auth/AuthContext';
import AppLayout from './shared/AppLayout';
import LoginPage from './modules/auth/LoginPage';
import DashboardPage from './modules/dashboard/DashboardPage';
import ProductsPage from './modules/products/ProductsPage';
import CategoriesPage from './modules/categories/CategoriesPage';
import SuppliersPage from './modules/suppliers/SuppliersPage';
import SalesPage from './modules/sales/SalesPage';
import TransactionsPage from './modules/transactions/TransactionsPage';
import ReportsPage from './modules/reports/ReportsPage';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
