import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getMyShippingApi, updateMyShippingApi } from '../utils/api';

const Shipping = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'India',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!token) return;
      try {
        const data = await getMyShippingApi(token);
        if (mounted && data) {
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch {}
    })();
    return () => { mounted = false; };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Save to localStorage for next pages
      localStorage.setItem('shippingData', JSON.stringify(formData));
      
      // Also save to backend if user is logged in
      if (token) {
        await updateMyShippingApi(token, formData);
      }
      
      navigate('/finalcheck');
    } catch (err) {
      alert(err.message || 'Failed to save shipping info');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['CART', 'INFORMATION', 'SHIPPING', 'PAYMENT'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 flex gap-8">
        {/* Left: Form */}
        <div className="flex-1">
          {/* Progress Steps */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            {steps.map((step, idx) => (
              <React.Fragment key={step}>
                {idx > 0 && <span className="text-gray-400">›</span>}
                <span className={idx === 1 ? 'font-medium text-black' : ''}>
                  {step}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-medium mb-6">Contact information</h2>
            
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="w-full px-4 py-2 border rounded mb-4"
              />

              <h2 className="text-xl font-medium mb-6">Shipping address</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  className="px-4 py-2 border rounded"
                />
              </div>

              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company name (optional)"
                className="w-full px-4 py-2 border rounded mb-4"
              />

              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded mb-4 bg-white"
              >
                <option value="India">India</option>
                {/* Add more countries as needed */}
              </select>

              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="Street address"
                required
                className="w-full px-4 py-2 border rounded mb-4"
              />

              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="w-full px-4 py-2 border rounded mb-4"
              />

              <div className="grid grid-cols-6 gap-4 mb-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Town / City"
                  required
                  className="col-span-2 px-4 py-2 border rounded"
                />
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="col-span-2 px-4 py-2 border rounded bg-white"
                >
                  <option value="">State</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    
                  {/* Add more states */}
                </select>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="PIN Code"
                  required
                  className="col-span-2 px-4 py-2 border rounded"
                />
              </div>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
                className="w-full px-4 py-2 border rounded mb-6"
              />

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="text-gray-600 hover:text-gray-100 flex items-center gap-2"
                >
                  ‹ Return to cart
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition-colors"
                >
                  {loading ? 'Saving...' : 'Continue to shipping'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="w-96">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                </div>
                <div className="text-sm font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-600">Free shipping</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="text-lg font-medium">TOTAL</span>
                <span className="text-lg font-medium">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
