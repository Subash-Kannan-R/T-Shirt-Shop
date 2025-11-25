import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listProductsApi } from "../utils/api";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await listProductsApi();
        if (mounted) {
            // Filter products that are in the wishlist
            const wishlistedProducts = data.filter(p => wishlist.includes(p._id));
            setProducts(wishlistedProducts);
        }
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load wishlist');
      } finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, [wishlist]); // Re-run when wishlist changes

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            My Wishlist
          </h1>
          <p className="text-gray-600 text-lg">Your favorite items saved for later</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent"></div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Loading your wishlist...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
             <div className="text-red-600 text-lg font-semibold">{error}</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-pink-50 rounded-full mb-6">
              <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Start adding items you love!</p>
            <button 
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map(p => {
              const img = (p.images && p.images[0]) || '';
              const isWishlisted = isInWishlist(p._id);
              
              return (
                <div 
                  key={p._id} 
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p._id);
                    }}
                    className={`absolute top-4 right-4 z-20 p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
                      isWishlisted 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 shadow-md'
                    }`}
                  >
                    <svg 
                      className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'scale-110' : ''}`}
                      fill={isWishlisted ? "currentColor" : "none"}
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                      />
                    </svg>
                  </button>

                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gray-100">
                    {img ? (
                      <img 
                        src={img} 
                        alt={p.name} 
                        className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-72 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300">
                      {p.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-pink-600">₹{p.price}</div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className={`inline-flex items-center ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${p.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
