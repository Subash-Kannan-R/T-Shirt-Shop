import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Finalcheck = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [orderNotes, setOrderNotes] = useState('');
  const [shippingData, setShippingData] = useState({});

  // Load shipping data from localStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem('shippingData');
      if (data) {
        setShippingData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load shipping data:', error);
    }
  }, []);

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleContinue = () => {
    // Save order notes to localStorage
    localStorage.setItem('orderNotes', orderNotes);
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex items-center gap-2 text-sm mb-8 text-gray-600">
          <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/cart')}>Cart</span>
          <span>›</span>
          <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/shipping')}>Shipping</span>
          <span>›</span>
          <span className="font-semibold text-purple-600">Review</span>
          <span>›</span>
          <span className="text-gray-400">Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact & Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div>
                  <span className="text-gray-600 text-sm block mb-1">Contact</span>
                  <span className="font-medium">{shippingData.email || 'No email provided'}</span>
                </div>
                <button 
                  onClick={() => navigate('/shipping')}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Change
                </button>
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-gray-600 text-sm block mb-1">Ship to</span>
                  <div className="font-medium">
                    {shippingData.firstName} {shippingData.lastName}
                    {shippingData.companyName && <div className="text-sm text-gray-600">{shippingData.companyName}</div>}
                    <div className="text-sm text-gray-700 mt-1">
                      {shippingData.streetAddress}
                      {shippingData.apartment && `, ${shippingData.apartment}`}
                      <br />
                      {shippingData.city}, {shippingData.state} {shippingData.pinCode}
                      <br />
                      {shippingData.country}
                      <br />
                      {shippingData.phone}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/shipping')}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="free-shipping"
                      name="shipping"
                      checked
                      readOnly
                      className="w-4 h-4 text-purple-600"
                    />
                    <label htmlFor="free-shipping" className="font-medium">
                      Free shipping
                    </label>
                  </div>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order notes (optional)</h2>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Notes about your order, e.g. special notes for delivery."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/shipping')}
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
              >
                ‹ Return to shipping
              </button>
              <button
                onClick={handleContinue}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Continue to payment
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finalcheck;
