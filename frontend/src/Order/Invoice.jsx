import React from 'react';
import { useCart } from '../context/CartContext';

const Invoice = () => {
  const { cart } = useCart();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const orderNumber = Math.floor(1000 + Math.random() * 9000);
  const date = new Date().toLocaleDateString();
  const paymentMethod = 'Cash on delivery';

  const billing = {
    name: '',
    street: '',
    city: '',
    pin: '',
    state: '',
    country: '',
    phone: '',
    email: ''
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-center text-2xl font-semibold mb-6">Thank you. Your order has been received.</h1>

        <div className="border-dashed border-2 border-green-300 p-6 rounded mb-8">
          <div className="grid grid-cols-4 gap-4 text-sm text-center">
            <div>
              <div className="text-gray-500">Order Number</div>
              <div className="font-medium">{orderNumber}</div>
            </div>
            <div>
              <div className="text-gray-500">Date</div>
              <div className="font-medium">{date}</div>
            </div>
            <div>
              <div className="text-gray-500">Total</div>
              <div className="font-medium">${total.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-500">Payment Method</div>
              <div className="font-medium">{paymentMethod}</div>
            </div>
          </div>
        </div>

        <p className="mb-6">Pay with cash upon delivery.</p>

        <h2 className="text-xl font-semibold mb-4">Order details</h2>
        <div className="bg-white border rounded mb-6">
          <div className="p-4 border-b">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between py-2">
                <div className="text-sm">{item.name} × {item.quantity}</div>
                <div className="text-sm">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50">
            <div className="flex justify-between py-1">
              <div className="text-sm">Subtotal:</div>
              <div className="text-sm">${total.toFixed(2)}</div>
            </div>
            <div className="flex justify-between py-1">
              <div className="text-sm">Shipping:</div>
              <div className="text-sm">Free shipping</div>
            </div>
            <div className="flex justify-between py-1">
              <div className="text-sm">Payment method:</div>
              <div className="text-sm">{paymentMethod}</div>
            </div>
            <div className="flex justify-between py-3 border-t mt-3">
              <div className="font-medium">TOTAL:</div>
              <div className="font-medium text-red-500">${total.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-2">Billing address</h3>
            <div className="text-sm">
              <div>{billing.name}</div>
              <div>{billing.street}</div>
              <div>{billing.city} {billing.pin}</div>
              <div>{billing.state}, {billing.country}</div>
              <div>{billing.phone}</div>
              <div>{billing.email}</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Shipping address</h3>
            <div className="text-sm">
              <div>{billing.name}</div>
              <div>{billing.street}</div>
              <div>{billing.city} {billing.pin}</div>
              <div>{billing.state}, {billing.country}</div>
              <div>{billing.phone}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
