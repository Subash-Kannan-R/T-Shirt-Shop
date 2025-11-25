const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Get auth token - matches AuthContext storage format
const getAuthToken = () => {
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.token;
    }
  } catch (error) {
    console.error('Failed to get auth token:', error);
  }
  return null;
};

// Create order
export const createOrder = async (orderData) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create order');
  }
  
  return response.json();
};

// Get my orders
export const getMyOrders = async () => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/orders/mine`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  
  return response.json();
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  
  return response.json();
};

// Cancel order
export const cancelOrder = async (orderId) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to cancel order');
  }
  
  return response.json();
};
