import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
let csrfToken = null;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const raw = localStorage.getItem('inventory-auth');
  if (raw) {
    const session = JSON.parse(raw);
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
  }

  const method = String(config.method || 'get').toLowerCase();
  const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(method);
  const isLoginRoute = String(config.url || '').includes('/auth/login');

  if (needsCsrf && !isLoginRoute) {
    if (!csrfToken) {
      const tokenResponse = await axios.get(`${API_BASE}/security/csrf-token`, { withCredentials: true });
      csrfToken = tokenResponse.data.csrfToken;
    }
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
});
