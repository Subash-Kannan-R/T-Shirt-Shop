const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

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

// Get user profile
export const getUserProfile = async () => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
};

// Update user profile
export const updateUserProfile = async (data) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }
  
  return response.json();
};

// Upload profile photo
export const uploadProfilePhoto = async (file) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('photo', file);
  
  const response = await fetch(`${API_URL}/api/users/profile/photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload photo');
  }
  
  return response.json();
};

// Change password
export const changePassword = async (data) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/users/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to change password');
  }
  
  return response.json();
};
