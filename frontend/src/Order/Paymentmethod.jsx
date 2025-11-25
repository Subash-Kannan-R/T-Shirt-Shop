import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../api/orders';

export default function Paymentmethod() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [placing, setPlacing] = useState(false);

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  // UPI details state
  const [upiId, setUpiId] = useState('');

  // Get shipping data from localStorage
  const getShippingData = () => {
    try {
      const data = localStorage.getItem('shippingData');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const shippingData = getShippingData();

  const calculateTotals = () => {
    const itemsPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingPrice = 0;
    const taxPrice = 0;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      showToast('Please enter a valid 16-digit card number', 'error');
      return false;
    }
    if (!cardDetails.cardName || cardDetails.cardName.trim().length < 3) {
      showToast('Please enter cardholder name', 'error');
      return false;
    }
    if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
      showToast('Please enter card expiry date', 'error');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      showToast('Please enter a valid 3-digit CVV', 'error');
      return false;
    }
    return true;
  };

  const validateUPI = () => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiId || !upiRegex.test(upiId)) {
      showToast('Please enter a valid UPI ID (e.g., username@paytm)', 'error');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    // Validate payment details based on method
    if (paymentMethod === 'card' && !validateCardDetails()) return;
    if (paymentMethod === 'upi' && !validateUPI()) return;
    if (paymentMethod === 'wallet' && !selectedWallet) {
      showToast('Please select a wallet', 'error');
      return;
    }
    if (paymentMethod === 'netbanking' && !selectedBank) {
      showToast('Please select a bank', 'error');
      return;
    }

    setPlacing(true);

    try {
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateTotals();

      const orderData = {
        email: shippingData.email || user?.email,
        items: cart.map(item => {
          const itemData = {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size || 'M',
            color: item.color || 'Black'
          };
          
          const productId = item._id || item.id;
          if (productId && productId.match(/^[0-9a-fA-F]{24}$/)) {
            itemData.product = productId;
          }
          
          return itemData;
        }),
        shippingAddress: {
          firstName: shippingData.firstName || '',
          lastName: shippingData.lastName || '',
          address: shippingData.streetAddress || '',
          apartment: shippingData.apartment || '',
          city: shippingData.city || '',
          state: shippingData.state || '',
          postalCode: shippingData.pinCode || '',
          country: shippingData.country || 'India',
          phone: shippingData.phone || ''
        },
        paymentMethod: paymentMethod === 'wallet' ? `${paymentMethod}-${selectedWallet}` : 
                       paymentMethod === 'netbanking' ? `${paymentMethod}-${selectedBank}` :
                       paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      };

      const order = await createOrder(orderData);
      clearCart();
      localStorage.removeItem('shippingData');
      
      showToast(`Order placed successfully! Order ID: ${order._id.slice(-8)}`, 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Order creation error:', error);
      showToast('Failed to place order: ' + error.message + '. Please make sure you are logged in.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay when you receive your order'
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, Rupay, Amex'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Google Pay, PhonePe, Paytm UPI'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'All major banks supported'
    },
    {
      id: 'wallet',
      name: 'Wallets',
      icon: '👛',
      description: 'Paytm, PhonePe, Amazon Pay'
    }
  ];

  const walletOptions = [
    { id: 'paytm', name: 'Paytm', icon: '💙' },
    { id: 'phonepe', name: 'PhonePe', icon: '💜' },
    { id: 'amazonpay', name: 'Amazon Pay', icon: '🟠' }
  ];

  const bankOptions = [
    { id: 'sbi', name: 'State Bank of India' },
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'axis', name: 'Axis Bank' },
    { id: 'kotak', name: 'Kotak Mahindra Bank' },
    { id: 'pnb', name: 'Punjab National Bank' },
    { id: 'bob', name: 'Bank of Baroda' },
    { id: 'canara', name: 'Canara Bank' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/cart')}>Cart</span>
            <span>›</span>
            <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/shipping')}>Shipping</span>
            <span>›</span>
            <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/finalcheck')}>Review</span>
            <span>›</span>
            <span className="font-semibold text-purple-600">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Payment Method</h2>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id}>
                  <div
                    onClick={() => setPaymentMethod(method.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="w-5 h-5 text-purple-600"
                      />
                      <span className="text-3xl">{method.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Details Form */}
                  {method.id === 'card' && paymentMethod === 'card' && (
                    <div className="ml-12 mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength="19"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={cardDetails.cardName}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value.toUpperCase() })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                          <select
                            value={cardDetails.expiryMonth}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiryMonth: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">MM</option>
                            {months.map(month => <option key={month} value={month}>{month}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <select
                            value={cardDetails.expiryYear}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiryYear: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">YYYY</option>
                            {years.map(year => <option key={year} value={year}>{year}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength="3"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 p-3 rounded">
                        <span>🔒</span>
                        <span>Your card details are encrypted and secure</span>
                      </div>
                    </div>
                  )}

                  {/* UPI Form with QR Code */}
                  {method.id === 'upi' && paymentMethod === 'upi' && (
                    <div className="ml-12 mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                      {/* UPI QR Code Section */}
                      <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Scan QR Code to Pay</h4>
                        
                        <div className="flex flex-col items-center space-y-4">
                          {/* QR Code */}
                          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                            <QRCodeSVG
                              value={`upi://pay?pa=merchant@paytm&pn=T-Shirt Shop&am=${calculateTotals().totalPrice.toFixed(2)}&cu=INR&tn=Order Payment`}
                              size={200}
                              level="H"
                              includeMargin={true}
                            />
                          </div>
                          
                          {/* UPI Apps */}
                          <div className="text-center">
                            <p className="text-xs text-gray-600 mb-2">Scan with any UPI app</p>
                            <div className="flex items-center justify-center gap-3">
                              <div className="flex flex-col items-center">
                                <span className="text-2xl">📱</span>
                                <span className="text-xs text-gray-500">GPay</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-2xl">💜</span>
                                <span className="text-xs text-gray-500">PhonePe</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-2xl">💙</span>
                                <span className="text-xs text-gray-500">Paytm</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-2xl">🏦</span>
                                <span className="text-xs text-gray-500">BHIM</span>
                              </div>
                            </div>
                          </div>

                          {/* Amount Display */}
                          <div className="bg-purple-50 px-4 py-2 rounded-lg">
                            <p className="text-sm text-gray-600">Amount to Pay</p>
                            <p className="text-2xl font-bold text-purple-600">₹{calculateTotals().totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-gray-50 text-gray-500">OR</span>
                        </div>
                      </div>

                      {/* Manual UPI ID Entry */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter UPI ID</label>
                        <input
                          type="text"
                          placeholder="username@paytm"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter your UPI ID (e.g., 9876543210@paytm, username@oksbi)</p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 p-3 rounded">
                        <span>ℹ️</span>
                        <span>Scan the QR code or enter your UPI ID to complete payment</span>
                      </div>
                    </div>
                  )}

                  {/* Net Banking Options */}
                  {method.id === 'netbanking' && paymentMethod === 'netbanking' && (
                    <div className="ml-12 mt-3 space-y-2">
                      <p className="text-sm font-medium text-gray-700 mb-2">Select Your Bank</p>
                      <div className="grid grid-cols-2 gap-2">
                        {bankOptions.map((bank) => (
                          <div
                            key={bank.id}
                            onClick={() => setSelectedBank(bank.id)}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedBank === bank.id
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                checked={selectedBank === bank.id}
                                onChange={() => setSelectedBank(bank.id)}
                                className="w-4 h-4 text-purple-600"
                              />
                              <span className="text-sm font-medium text-gray-900">{bank.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wallet Sub-options */}
                  {method.id === 'wallet' && paymentMethod === 'wallet' && (
                    <div className="ml-12 mt-3 space-y-2">
                      {walletOptions.map((wallet) => (
                        <div
                          key={wallet.id}
                          onClick={() => setSelectedWallet(wallet.id)}
                          className={`border rounded-lg p-3 cursor-pointer transition-all ${
                            selectedWallet === wallet.id
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              checked={selectedWallet === wallet.id}
                              onChange={() => setSelectedWallet(wallet.id)}
                              className="w-4 h-4 text-purple-600"
                            />
                            <span className="text-2xl">{wallet.icon}</span>
                            <span className="font-medium text-gray-900">{wallet.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placing ? 'Processing...' : `Place Order - ₹${calculateTotals().totalPrice.toFixed(2)}`}
            </button>
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
                <span>₹{calculateTotals().itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{calculateTotals().totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
