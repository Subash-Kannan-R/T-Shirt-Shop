import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Shop() {
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const categories = [
    { label: "Hoodies", type: "Hoodie" },
    { label: "T-Shirts", type: "T-Shirt" },
    { label: "Polo Shirts", type: "Polo" },
    { label: "Sweatshirts", type: "Sweatshirt" }
  ];
  const sizes = ["L", "M", "S", "XL", "XXL"];
  const [showStatus, setShowStatus] = useState(false);
  const statusOptions = [
    { label: "On Sale", id: "onsale" },
    { label: "Featured", id: "featured" },
    { label: "In Stock", id: "instock" },
  ];
  const [showPrice, setShowPrice] = useState(false);
  const [minPrice, setMinPrice] = useState(10);
  const [maxPrice, setMaxPrice] = useState(800);
  const [showSort, setShowSort] = useState(false);

  return (
    <div className="w-full px-8 py-6">
      {/* Filter and Sort Bar */}
      <div className="flex flex-wrap items-center justify-between border-b pb-4 mb-8 relative">
        <div className="flex items-center gap-6">
          <span className="font-medium text-black">Filter by:</span>
          <div className="relative">
            <button
              className="flex items-center gap-2 text-black font-semibold bg-transparent"
              onClick={() => setShowCategories((prev) => !prev)}
            >
              <span className="inline-block">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <line x1="8" y1="9" x2="16" y2="9" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                </svg>
              </span>
              Categories
            </button>
            {showCategories && (
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                {categories.map((cat) => (
                  <div
                    key={cat.type}
                    className="flex justify-between items-center px-8 py-4 text-black hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      // navigate to shop with type query param to filter products
                      navigate(`/shop?type=${encodeURIComponent(cat.type)}`);
                      setShowCategories(false);
                    }}
                  >
                    <span>{cat.label}</span>
                    <span className="text-xl font-light">+</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              className="text-black font-semibold bg-transparent"
              onClick={() => setShowSizes((prev) => !prev)}
            >
              Size <span className="ml-1">▼</span>
            </button>
            {showSizes && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-full flex justify-between items-center gap-2 bg-white p-3 rounded-md shadow-lg z-10">
                {sizes.map((size) => (
                  <div 
                    key={size} 
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search);
                      params.set('size', size);
                      navigate(`/shop?${params.toString()}`);
                      setShowSizes(false);
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center mb-1 transition-colors">
                      <span className="text-black text-lg font-normal">{size}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              className="text-black font-semibold bg-transparent"
              onClick={() => setShowPrice((prev) => !prev)}
            >
              Price <span className="ml-1">▼</span>
            </button>
            {showPrice && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white p-4 rounded-md shadow-lg z-10">
                {[
                  { label: 'Below ₹500', range: '0-500' },
                  { label: '₹500-₹800', range: '500-800' },
                  { label: '₹800-₹1000', range: '800-1000' },
                  { label: '₹1000-₹1300', range: '1000-1300' },
                  { label: 'Above ₹1300', range: '1300-2000' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center mb-3 px-3 py-2 cursor-pointer text-black text-base hover:bg-gray-100 rounded"
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search);
                      params.set('price', item.range);
                      navigate(`/shop?${params.toString()}`);
                      setShowPrice(false);
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              className="text-block-500 font-semibold bg-transparent"
              onClick={() => setShowStatus((prev) => !prev)}
            >
              Status <span className="ml-1">▼</span>
            </button>
            {showStatus && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[320px] bg-white p-4 rounded-md shadow-lg z-10">
                {statusOptions.map((option) => (
                  <div
                    key={option.id}
                    className="px-3 py-2 mb-2 rounded hover:bg-gray-100 cursor-pointer text-black text-base"
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search);
                      params.set('status', option.id);
                      navigate(`/shop?${params.toString()}`);
                      setShowStatus(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
