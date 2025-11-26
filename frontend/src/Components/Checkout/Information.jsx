import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../context/CheckoutContext';

export default function Information() {
  const navigate = useNavigate();
  const { checkoutData, setCheckoutData, loading } = useCheckout();
  
  const [formData, setFormData] = useState({
    email: checkoutData.email || '',
    firstName: checkoutData.shippingAddress.firstName || '',
    lastName: checkoutData.shippingAddress.lastName || '',
    company: checkoutData.shippingAddress.company || '',
    country: checkoutData.shippingAddress.country || 'India',
    address: checkoutData.shippingAddress.address || '',
    apartment: checkoutData.shippingAddress.apartment || '',
    city: checkoutData.shippingAddress.city || '',
    state: checkoutData.shippingAddress.state || '',
    postalCode: checkoutData.shippingAddress.postalCode || '',
    phone: checkoutData.shippingAddress.phone || ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      // Save to database via API
      await setCheckoutData({
        email: formData.email,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          country: formData.country,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          phone: formData.phone
        }
      });
      
      // Navigate to shipping page
      navigate('/checkout/shipping');
    } catch (error) {
      alert('Failed to save checkout information. Please try again.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="font-semibold">CART</span>
            <span className="text-gray-400">›</span>
            <span className="font-semibold text-blue-600">INFORMATION</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-400">SHIPPING</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-400">PAYMENT</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Contact information</h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Shipping address</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <input
                  type="text"
                  name="company"
                  placeholder="Company name (optional)"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />



                <input
                  type="text"
                  name="address"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />

                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  value={formData.apartment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="Town / City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {formData.country === 'India' ? (
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                      <option value="Chandigarh">Chandigarh</option>
                      <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Lakshadweep">Lakshadweep</option>
                      <option value="Puducherry">Puducherry</option>
                      <option value="Ladakh">Ladakh</option>
                      <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="state"
                      placeholder="State / Province"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="PIN Code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ‹ Return to cart
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md font-medium transition-colors disabled:bg-gray-400"
                >
                  {saving ? 'Saving...' : 'Continue to shipping'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            {/* Cart items will be displayed here */}
            <div className="text-gray-500 text-center py-8">
              Cart items will be displayed here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
