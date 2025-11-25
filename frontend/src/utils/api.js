const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const api = async (path, { method = 'GET', body, token } = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || data?.errors?.[0]?.msg || 'Request failed';
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

export const loginApi = (email, password) => api('/api/auth/login', { method: 'POST', body: { email, password } });
export const registerApi = (name, email, password) => api('/api/auth/register', { method: 'POST', body: { name, email, password } });

// Products
export const listProductsApi = () => api('/api/products');
export const getProductApi = (id) => api(`/api/products/${id}`);
export const createProductApi = (token, payload) => api('/api/products', { method: 'POST', token, body: payload });
export const updateProductApi = (token, id, payload) => api(`/api/products/${id}`, { method: 'PUT', token, body: payload });
export const deleteProductApi = (token, id) => api(`/api/products/${id}`, { method: 'DELETE', token });

// Categories
export const listCategoriesApi = () => api('/api/categories');
export const createCategoryApi = (token, payload) => api('/api/categories', { method: 'POST', token, body: payload });

// Orders
export const listOrdersApi = (token) => api('/api/orders', { token });
export const updateOrderStatusApi = (token, id, payload) => api(`/api/orders/${id}`, { method: 'PUT', token, body: payload });
export const getMyOrdersApi = (token) => api('/api/orders/mine', { token });

// Users
export const listUsersApi = (token) => api('/api/users', { token });
export const getMyShippingApi = (token) => api('/api/users/me/shipping', { token });
export const updateMyShippingApi = (token, payload) => api('/api/users/me/shipping', { method: 'PUT', token, body: payload });

// Password reset
export const forgotPasswordApi = (email) => api('/api/auth/forgot-password', { method: 'POST', body: { email } });
export const resetPasswordApi = (token, password, email, otp) => {
  const body = email && otp ? { email, otp, password } : { token, password };
  return api('/api/auth/reset-password', { method: 'POST', body });
};
