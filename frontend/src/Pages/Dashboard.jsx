import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../api/orders';
import { 
  updateProfile, 
  uploadProfilePhoto, 
  changePassword, 
  getShippingAddress, 
  updateShippingAddress 
} from '../api/users';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, login } = useAuth();
  const [activeSection, setActiveSection] = useState('orders');
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  // Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [photoPreview, setPhotoPreview] = useState(null);

  // Address State
  const [shippingAddress, setShippingAddress] = useState({});
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressMessage, setAddressMessage] = useState({ type: '', text: '' });

  // Support State
  const [supportForm, setSupportForm] = useState({ subject: 'Order Issue', message: '' });
  const [supportMessage, setSupportMessage] = useState('');

  // Initialize profile data from user context
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || ''
      });
      setPhotoPreview(user.profilePhoto ? `http://localhost:5001${user.profilePhoto}` : null);
    }
  }, [user]);

  // Fetch Orders
  useEffect(() => {
    if (activeSection === 'orders') {
      const fetchOrders = async () => {
        try {
          setLoadingOrders(true);
          setOrdersError('');
          const data = await getMyOrders();
          setOrders(data);
        } catch (err) {
          console.error('Error fetching orders:', err);
          setOrdersError(err.message || 'Failed to load orders');
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeSection]);

  // Fetch Address
  useEffect(() => {
    if (activeSection === 'addresses') {
      const fetchAddress = async () => {
        try {
          const data = await getShippingAddress();
          setShippingAddress(data);
        } catch (err) {
          console.error('Error fetching address:', err);
        }
      };
      fetchAddress();
    }
  }, [activeSection]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Profile Handlers
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    try {
      const updatedUser = await updateProfile(profileData);
      // Update local storage/context
      const authData = JSON.parse(localStorage.getItem('auth'));
      login({ ...authData, user: updatedUser });
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditingProfile(false);
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.message });
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const response = await uploadProfilePhoto(file);
      // Update context
      const authData = JSON.parse(localStorage.getItem('auth'));
      login({ ...authData, user: response.user });
      setProfileMessage({ type: 'success', text: 'Photo updated successfully!' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.message });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      setProfileMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    try {
      await changePassword(passwordData.current, passwordData.new);
      setProfileMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.message });
    }
  };

  // Address Handlers
  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    setAddressMessage({ type: '', text: '' });
    try {
      const updatedAddress = await updateShippingAddress(shippingAddress);
      setShippingAddress(updatedAddress);
      setAddressMessage({ type: 'success', text: 'Address saved successfully!' });
      setIsEditingAddress(false);
    } catch (err) {
      setAddressMessage({ type: 'error', text: err.message });
    }
  };

  // Support Handler
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    // Placeholder for actual API call
    setSupportMessage('Ticket submitted successfully! We will contact you shortly.');
    setSupportForm({ subject: 'Order Issue', message: '' });
    setTimeout(() => setSupportMessage(''), 3000);
  };

  const menuItems = [
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'support', label: 'Customer Support', icon: '💬' },
    { id: 'referrals', label: 'Manage Referrals', icon: '❤️' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  if (!user) return null;

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 p-6 shadow-sm">
        {/* User Profile Section */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-purple-500 overflow-hidden flex items-center justify-center text-white text-2xl font-bold relative group">
              {user.profilePhoto ? (
                <img 
                  src={`http://localhost:5001${user.profilePhoto}`} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          </div>
        </div>



        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${
                activeSection === item.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Log Out Button */}
        <button 
          onClick={handleLogout}
          className="w-full mt-8 pt-6 border-t border-gray-200 text-gray-900 font-semibold py-2 hover:text-red-600 transition-colors bg-transparent text-left px-4 flex items-center gap-3"
        >
          <span className="text-xl">🚪</span>
          Log Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* Orders Section */}
        {activeSection === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            {loadingOrders && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            )}
            {ordersError && <p className="text-red-600 mb-4">{ordersError}</p>}
            {!loadingOrders && !ordersError && orders.length > 0 && (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                        <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-4">
                      <p className="font-bold text-lg">Total: ₹{order.totalPrice}</p>
                      <button
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loadingOrders && !ordersError && orders.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="bg-purple-600 text-white font-semibold px-6 py-2 rounded hover:bg-purple-700 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>
            
            {profileMessage.text && (
              <div className={`p-4 rounded mb-6 ${profileMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {profileMessage.text}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border">
              <div className="flex items-start gap-6 mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden border-2 border-purple-200">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">👤</span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-purple-700 shadow-sm">
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </label>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="text-gray-500 mt-1">{user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                </div>
              </div>

              {!isEditingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Full Name</label>
                      <p className="mt-1 font-medium">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="mt-1 font-medium">{user.phone || 'Not set'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="mt-4 text-purple-600 font-medium hover:underline"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Save Changes</button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditingProfile(false)}
                      className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h3 className="text-lg font-bold mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Addresses Section */}
        {activeSection === 'addresses' && (
          <div className="max-w-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Addresses</h2>
              {!isEditingAddress && (
                <button 
                  onClick={() => setIsEditingAddress(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  {Object.keys(shippingAddress).length ? 'Edit Address' : 'Add Address'}
                </button>
              )}
            </div>

            {addressMessage.text && (
              <div className={`p-4 rounded mb-6 ${addressMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {addressMessage.text}
              </div>
            )}

            {!isEditingAddress ? (
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                {Object.keys(shippingAddress).length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">DEFAULT SHIPPING</span>
                    </div>
                    <h3 className="font-bold text-lg">{shippingAddress.firstName} {shippingAddress.lastName}</h3>
                    <p className="text-gray-600 mt-1">{shippingAddress.streetAddress}</p>
                    {shippingAddress.apartment && <p className="text-gray-600">{shippingAddress.apartment}</p>}
                    <p className="text-gray-600">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pinCode}</p>
                    <p className="text-gray-600">{shippingAddress.country}</p>
                    <p className="text-gray-600 mt-2">Phone: {shippingAddress.phone}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No shipping address saved yet.</p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleAddressUpdate} className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-lg font-bold mb-4">Edit Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={shippingAddress.firstName || ''}
                      onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                      className="w-full border rounded px-3 py-2 outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={shippingAddress.lastName || ''}
                      onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                      className="w-full border rounded px-3 py-2 outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={shippingAddress.streetAddress || ''}
                      onChange={(e) => setShippingAddress({...shippingAddress, streetAddress: e.target.value})}
                      className="w-full border rounded px-3 py-2 outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apartment/Suite (Optional)</label>
                    <input
                      type="text"
                      value={shippingAddress.apartment || ''}
                      onChange={(e) => setShippingAddress({...shippingAddress, apartment: e.target.value})}
                      className="w-full border rounded px-3 py-2 outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city || ''}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      className="w-full border rounded px-3 py-2 outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={shippingAddress.state || ''}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      className="w-full border rounded px-3 py-2 outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={shippingAddress.pinCode || ''}
                      onChange={(e) => setShippingAddress({...shippingAddress, pinCode: e.target.value})}
                      className="w-full border rounded px-3 py-2 outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={shippingAddress.country || ''}
                      onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                      className="w-full border rounded px-3 py-2 outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={shippingAddress.phone || ''}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      className="w-full border rounded px-3 py-2 outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">Save Address</button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingAddress(false)}
                    className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Customer Support Section */}
        {activeSection === 'support' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Customer Support</h2>
            
            {supportMessage && (
              <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
                {supportMessage}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 border mb-8">
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select 
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                    className="w-full border rounded px-3 py-2 outline-none focus:border-purple-500 bg-white"
                  >
                    <option>Order Issue</option>
                    <option>Product Inquiry</option>
                    <option>Payment Issue</option>
                    <option>Returns & Refunds</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows="5"
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                    className="w-full border rounded px-3 py-2 outline-none focus:border-purple-500"
                    placeholder="Describe your issue here..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                  Submit Ticket
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Frequently Asked Questions</h3>
              <div className="bg-white rounded-lg border p-4">
                <h4 className="font-medium text-purple-900">How do I track my order?</h4>
                <p className="text-gray-600 mt-2 text-sm">You can track your order in the "Orders" section of your dashboard. Click on "View Details" to see the current status.</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <h4 className="font-medium text-purple-900">What is the return policy?</h4>
                <p className="text-gray-600 mt-2 text-sm">We accept returns within 7 days of delivery. Items must be unused and in original packaging.</p>
              </div>
            </div>
          </div>
        )}

        {/* Referrals Section */}
        {activeSection === 'referrals' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Manage Referrals</h2>
            
            <div className="bg-purple-600 text-white rounded-xl p-8 mb-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Invite Friends & Earn</h3>
              <p className="opacity-90 mb-6">Share your unique code and get ₹100 for every friend who makes their first purchase!</p>
              
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg inline-flex items-center gap-4 border border-white/30">
                <span className="font-mono text-xl font-bold tracking-wider">{user.name.substring(0, 3).toUpperCase()}{user._id.substring(user._id.length - 4).toUpperCase()}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${user.name.substring(0, 3).toUpperCase()}${user._id.substring(user._id.length - 4).toUpperCase()}`);
                    alert('Code copied!');
                  }}
                  className="bg-white text-purple-600 px-3 py-1 rounded text-sm font-bold hover:bg-gray-100"
                >
                  COPY
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-3xl mb-2">👥</div>
                <h4 className="font-bold text-gray-900">Total Referrals</h4>
                <p className="text-2xl font-bold text-purple-600">0</p>
                <p className="text-sm text-gray-500">Friends joined</p>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-3xl mb-2">💰</div>
                <h4 className="font-bold text-gray-900">Total Earnings</h4>
                <p className="text-2xl font-bold text-green-600">₹0</p>
                <p className="text-sm text-gray-500">Credits earned</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
