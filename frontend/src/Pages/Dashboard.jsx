import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('orders');

  const menuItems = [
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'support', label: 'Customer Support', icon: '💬' },
    { id: 'referrals', label: 'Manage Referrals', icon: '❤️' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 p-6 shadow-sm">
        {/* User Profile Section */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              S
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Subash</h2>
              <p className="text-gray-600">8838506695</p>
            </div>
          </div>
        </div>

        {/* Zepto Cash Card Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center text-white font-bold text-sm">Z</div>
            <span className="font-semibold text-gray-900">T-Shirt Cornerwhe Cash & Gift Card</span>
          </div>
          <div className="bg-gray-50 rounded p-4 mb-3">
            <p className="text-gray-600 text-sm mb-2">Available Balance: <span className="font-bold text-gray-900">₹0</span></p>
            <button className="w-full bg-white border border-gray-300 text-gray-900 font-semibold py-2 rounded hover:bg-gray-50">
              Add Balance
            </button>
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
        <button className="w-full mt-8 pt-6 border-t border-gray-200 text-gray-900 font-semibold py-2 hover:text-red-600 transition-colors bg-transparent">
          Log Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {/* Orders Section */}
        {activeSection === 'orders' && (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-purple-600 rounded-lg flex items-center justify-center relative">
                <span className="text-5xl">📦</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  
                </span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <button 
              onClick={() => navigate('/shop')}
              className="border-2 border-purple-600 text-purple-600 font-semibold px-6 py-2 rounded hover:bg-purple-50 transition-colors"
            >
              Browse products
            </button>
          </div>
        )}

        {/* Other Sections (Placeholder) */}
        {activeSection !== 'orders' && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {menuItems.find(item => item.id === activeSection)?.label}
            </h2>
            <p className="text-gray-600">Content for this section coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
