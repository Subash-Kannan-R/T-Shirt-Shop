const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Generate or get session ID - using localStorage for persistence across pages
const getSessionId = () => {
  let sessionId = localStorage.getItem('checkoutSessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('checkoutSessionId', sessionId);
    console.log('Created new session ID:', sessionId);
  } else {
    console.log('Using existing session ID:', sessionId);
  }
  return sessionId;
};

// Get checkout data
export const getCheckout = async () => {
  const sessionId = getSessionId();
  const response = await fetch(`${API_URL}/api/checkout/${sessionId}`);
  if (!response.ok) throw new Error('Failed to get checkout');
  return response.json();
};

// Update checkout data
export const updateCheckout = async (data) => {
  const sessionId = getSessionId();
  const response = await fetch(`${API_URL}/api/checkout/${sessionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update checkout');
  return response.json();
};

// Complete checkout
export const completeCheckout = async () => {
  const sessionId = getSessionId();
  const response = await fetch(`${API_URL}/api/checkout/${sessionId}/complete`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to complete checkout');
  return response.json();
};

// Delete checkout
export const deleteCheckout = async () => {
  const sessionId = getSessionId();
  const response = await fetch(`${API_URL}/api/checkout/${sessionId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete checkout');
  localStorage.removeItem('checkoutSessionId');
  return response.json();
};
