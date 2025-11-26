import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProductsApi } from '../../utils/api';
import { useWishlist } from '../../context/WishlistContext';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listProductsApi();
        // Take first 4 products as featured
        setProducts(data.slice(0, 4));
      } catch (e) {
        console.error('Failed to load featured products', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Collection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular styles, crafted for comfort and designed for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => {
            const img = (p.images && p.images[0]) || '';
            const isWishlisted = isInWishlist(p._id);

            return (
              <div 
                key={p._id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(p._id);
                  }}
                  className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
                    isWishlisted 
                      ? 'bg-red-50 text-red-500' 
                      : 'bg-white/80 text-gray-400 hover:text-red-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  {img ? (
                    <img 
                      src={img} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      View Details
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-600 font-bold">₹{p.price}</span>
                    {p.rating && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="text-yellow-400 mr-1">★</span>
                        {p.rating}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-colors duration-300"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
