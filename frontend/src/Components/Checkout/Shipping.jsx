import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../context/CheckoutContext';

export default function Shipping() {
  const navigate = useNavigate();
  const { checkoutData, loadCheckout, loading } = useCheckout();
  const { email, shippingAddress } = checkoutData;

  // Reload checkout data from database when component mounts
  useEffect(() => {
    loadCheckout();
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Shipping component - checkoutData:', checkoutData);
    console.log('Shipping component - email:', email);
    console.log('Shipping component - shippingAddress:', shippingAddress);
  }, [checkoutData, email, shippingAddress]);

  const handleContinue = () => {
    navigate('/checkout/payment');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-gray-400">CART</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-400">INFORMATION</span>
            <span className="text-gray-400">›</span>
            <span className="font-semibold text-blue-600">SHIPPING</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-400">PAYMENT</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          {/* DEBUG INFO */}
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre className="text-xs overflow-auto">{JSON.stringify({ email, shippingAddress }, null, 2)}</pre>
          </div>

          {/* Contact Information */}
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div>
              <span className="text-gray-600 text-sm">Contact</span>
              <p className="font-medium">{email || 'No email provided'}</p>
            </div>
            <button
              onClick={() => navigate('/checkout/information')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Change
            </button>
          </div>

          {/* Shipping Address */}
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div>
              <span className="text-gray-600 text-sm">Ship to</span>
              <p className="font-medium">
                {shippingAddress.firstName} {shippingAddress.lastName}
                {shippingAddress.company && `, ${shippingAddress.company}`}
                <br />
                {shippingAddress.address}
                {shippingAddress.apartment && `, ${shippingAddress.apartment}`}
                <br />
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                <br />
                {shippingAddress.country}
                <br />
                {shippingAddress.phone}
              </p>
            </div>
            <button
              onClick={() => navigate('/checkout/information')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Change
            </button>
          </div>

          {/* Shipping Methods */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Methods</h2>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="free-shipping"
                    name="shipping"
                    checked
                    readOnly
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="free-shipping" className="font-medium">
                    Free shipping
                  </label>
                </div>
                <span className="font-medium">Free</span>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Order notes (optional)</h2>
            <textarea
              placeholder="Notes about your order, e.g. special notes for delivery."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => navigate('/checkout/information')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ‹ Return to information
            </button>
            <button
              onClick={handleContinue}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md font-medium transition-colors"
            >
              Continue to payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
