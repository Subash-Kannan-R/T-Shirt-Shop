import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../context/CheckoutContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createOrder } from '../../api/orders';

export default function Payment() {
  const navigate = useNavigate();
  const { checkoutData, clearCheckoutData, loadCheckout, loading } = useCheckout();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);

  // Reload checkout data from database when component mounts
  useEffect(() => {
    loadCheckout();
  }, []);

  // Calculate totals
  const calculateTotals = () => {
    const itemsPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingPrice = 0; // Free shipping
    const taxPrice = 0;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    
    try {
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateTotals();
      
      // Prepare order data
      const orderData = {
        email: checkoutData.email,
        items: cart.map(item => {
          const itemData = {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size || 'M',
            color: item.color || 'Black'
          };
          
          // Only include product ID if it's a valid MongoDB ObjectId
          const productId = item._id || item.id;
          if (productId && productId.match(/^[0-9a-fA-F]{24}$/)) {
            itemData.product = productId;
          }
          
          return itemData;
        }),
        shippingAddress: {
          firstName: checkoutData.shippingAddress.firstName,
          lastName: checkoutData.shippingAddress.lastName,
          company: checkoutData.shippingAddress.company,
          address: checkoutData.shippingAddress.address,
          apartment: checkoutData.shippingAddress.apartment,
          city: checkoutData.shippingAddress.city,
          state: checkoutData.shippingAddress.state,
          postalCode: checkoutData.shippingAddress.postalCode,
          country: checkoutData.shippingAddress.country,
          phone: checkoutData.shippingAddress.phone
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      };
      
      // Create order via API
      const order = await createOrder(orderData);
      
      // Clear checkout and cart data
      clearCheckoutData();
      clearCart();
      
      // Navigate to order confirmation or dashboard
      showToast(`Order placed successfully! Order ID: ${order._id.slice(-8)}`, 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Order creation error:', error);
      showToast('Failed to place order: ' + error.message + '. Please make sure you are logged in.', 'error');
    } finally {
      setPlacing(false);
    }
  };

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
            <span className="text-gray-400">SHIPPING</span>
            <span className="text-gray-400">›</span>
            <span className="font-semibold text-blue-600">PAYMENT</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          {/* Contact Information */}
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div>
              <span className="text-gray-600 text-sm">Contact</span>
              <p className="font-medium">{checkoutData.email}</p>
            </div>
            <button
              onClick={() => navigate('/checkout/information')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Change
            </button>
          </div>

          {/* Shipping Address */}
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div>
              <span className="text-gray-600 text-sm">Ship to</span>
              <p className="font-medium">
                {checkoutData.shippingAddress.address}, {checkoutData.shippingAddress.city}
              </p>
            </div>
            <button
              onClick={() => navigate('/checkout/information')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Change
            </button>
          </div>

          {/* Shipping Method */}
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div>
              <span className="text-gray-600 text-sm">Method</span>
              <p className="font-medium">Free shipping</p>
            </div>
            <button
              onClick={() => navigate('/checkout/shipping')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Change
            </button>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            
            <div className="space-y-3">
              <div className="border border-gray-300 rounded-md p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="cod" className="font-medium">
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>

              <div className="border border-gray-300 rounded-md p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="card"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="card" className="font-medium">
                    Credit / Debit Card
                  </label>
                </div>
              </div>

              <div className="border border-gray-300 rounded-md p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="upi"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="upi" className="font-medium">
                    UPI
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{calculateTotals().itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">Free shipping</span>
            </div>
            <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t">
              <span>TOTAL</span>
              <span>₹{calculateTotals().totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => navigate('/checkout/shipping')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ‹ Return to shipping
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md font-medium transition-colors disabled:bg-gray-400"
            >
              {placing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
