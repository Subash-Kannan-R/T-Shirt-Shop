import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-24 h-24 object-cover rounded"
              />
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 bg-transparent border border-gray-300 rounded text-gray-700 hover:border-purple-600 hover:text-purple-600 focus:outline-none transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-transparent border border-gray-300 rounded text-gray-700 hover:border-purple-600 hover:text-purple-600 focus:outline-none transition-colors"
                >
                  +
                </button>
              </div>

              <div className="text-lg font-semibold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-transparent border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded transition-colors text-sm font-medium"
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold">₹{total.toFixed(2)}</span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/shop')}
              className="flex-1 bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition-colors"
            >
              Continue Shopping
            </button>
           
            <button 
              onClick={() => navigate('/shipping')}
              className="flex-1 bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;