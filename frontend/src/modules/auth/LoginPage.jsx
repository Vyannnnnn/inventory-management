import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('owner');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await login(username, password);
      toast.success('Login berhasil');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form className="card w-full max-w-md space-y-3" onSubmit={onSubmit}>
        <h1 className="text-xl font-bold">Login Sistem Toko</h1>
        <input className="input" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" />
        <input className="input" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" />
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Memproses...' : 'Masuk'}</button>
      </form>
    </div>
  );
};

export default LoginPage;
