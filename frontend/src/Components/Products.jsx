// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { listProductsApi } from "../utils/api";

// const Products = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const type = params.get('type'); // product type
//   const size = params.get('size'); // size filter
//   const priceRange = params.get('price'); // e.g. 0-40
//   const status = params.get('status'); // status filter

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const priceFilter = useMemo(() => {
//     if (!priceRange) return null;
//     const [minStr, maxStr] = priceRange.split('-');
//     return { min: parseInt(minStr), max: parseInt(maxStr) };
//   }, [priceRange]);

//   useEffect(() => {
//     let mounted = true;
//     const load = async () => {
//       try {
//         const data = await listProductsApi();
//         if (mounted) setProducts(data);
//       } catch (e) {
//         if (mounted) setError(e.message || 'Failed to load products');
//       } finally { if (mounted) setLoading(false); }
//     };
//     load();
//     return () => { mounted = false; };
//   }, []);

//   const filtered = useMemo(() => {
//     return products.filter(p => {
//       // Filter by type
//       if (type && p.type !== type) return false;
      
//       // Filter by size
//       if (size && (!p.sizes || !p.sizes.includes(size))) return false;
      
//       // Filter by price
//       if (priceFilter) {
//         const price = Number(p.price || 0);
//         if (isNaN(price)) return false;
//         if (price < priceFilter.min || price > priceFilter.max) return false;
//       }
      
//       // Filter by status
//       if (status) {
//         if (status === 'instock' && (!p.stock || p.stock <= 0)) return false;
//         // For 'onsale' and 'featured', we'll just show all products for now
//         // since these fields don't exist yet
//       }
      
//       return true;
//     });
//   }, [products, type, size, priceFilter, status]);

//   const clearFilters = () => {
//     navigate('/shop');
//   };

//   const hasActiveFilters = type || size || priceRange || status;

//   const removeFilter = (filterName) => {
//     const newParams = new URLSearchParams(location.search);
//     newParams.delete(filterName);
//     navigate(`/shop?${newParams.toString()}`);
//   };

//   return (
//     <div className="w-full min-h-screen bg-background px-8 py-8">
//       <div className="container mx-auto max-w-7xl">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Featured Products</h1>
//           <p className="text-muted-foreground text-lg">Explore our collection by category</p>
//         </div>

//         {/* Active Filters & Result Count */}
//         <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
//           <div className="flex items-center gap-3 flex-wrap">
//             {type && (
//               <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
//                 <span>Type: {type}</span>
//                 <button 
//                   onClick={() => removeFilter('type')}
//                   className="hover:bg-blue-200 rounded-full p-1 transition-colors"
//                   aria-label="Remove type filter"
//                 >
//                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <line x1="18" y1="6" x2="6" y2="18"></line>
//                     <line x1="6" y1="6" x2="18" y2="18"></line>
//                   </svg>
//                 </button>
//               </div>
//             )}
//             {size && (
//               <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
//                 <span>Size: {size}</span>
//                 <button 
//                   onClick={() => removeFilter('size')}
//                   className="hover:bg-purple-200 rounded-full p-1 transition-colors"
//                   aria-label="Remove size filter"
//                 >
//                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <line x1="18" y1="6" x2="6" y2="18"></line>
//                     <line x1="6" y1="6" x2="18" y2="18"></line>
//                   </svg>
//                 </button>
//               </div>
//             )}
//             {priceRange && (
//               <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
//                 <span>Price: ₹{priceRange.replace('-', ' - ₹')}</span>
//                 <button 
//                   onClick={() => removeFilter('price')}
//                   className="hover:bg-green-200 rounded-full p-1 transition-colors"
//                   aria-label="Remove price filter"
//                 >
//                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <line x1="18" y1="6" x2="6" y2="18"></line>
//                     <line x1="6" y1="6" x2="18" y2="18"></line>
//                   </svg>
//                 </button>
//               </div>
//             )}
//             {status && (
//               <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
//                 <span>Status: {status === 'instock' ? 'In Stock' : status === 'onsale' ? 'On Sale' : 'Featured'}</span>
//                 <button 
//                   onClick={() => removeFilter('status')}
//                   className="hover:bg-orange-200 rounded-full p-1 transition-colors"
//                   aria-label="Remove status filter"
//                 >
//                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <line x1="18" y1="6" x2="6" y2="18"></line>
//                     <line x1="6" y1="6" x2="18" y2="18"></line>
//                   </svg>
//                 </button>
//               </div>
//             )}
//             {hasActiveFilters && (
//               <button 
//                 onClick={clearFilters}
//                 className="text-sm text-gray-600 hover:text-gray-900 underline font-medium transition-colors"
//               >
//                 Clear all filters
//               </button>
//             )}
//           </div>
//           <div className="text-gray-500 font-medium">
//             {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
//           </div>
//         </div>

//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//             <p className="mt-4 text-gray-600">Loading products...</p>
//           </div>
//         ) : error ? (
//           <div className="text-center py-12">
//             <div className="text-red-600 text-lg">{error}</div>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-muted-foreground text-lg">No products found.</div>
//             {hasActiveFilters && (
//               <button 
//                 onClick={clearFilters}
//                 className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Clear filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//             {filtered.map(p => {
//               const img = (p.images && p.images[0]) || '';
//               return (
//                 <div key={p._id} className="glass-effect rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/product/${p._id}`)}>
//                   <div className="relative overflow-hidden rounded-xl mb-4 w-full">
//                     {img ? (
//                       <img src={img} alt={p.name} className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500" />
//                     ) : (
//                       <div className="w-full h-72 bg-gray-100 flex items-center justify-center">No Image</div>
//                     )}
//                     <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   </div>
//                   <h3 className="text-lg font-semibold mb-2 text-center text-foreground">{p.name}</h3>
//                   <div className="text-base text-primary font-semibold">₹{p.price}</div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Products


import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { listProductsApi } from "../utils/api";
import { useWishlist } from "../context/WishlistContext";

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get('type');
  const size = params.get('size');
  const priceRange = params.get('price');
  const status = params.get('status');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toggleWishlist, isInWishlist } = useWishlist();

  const priceFilter = useMemo(() => {
    if (!priceRange) return null;
    const [minStr, maxStr] = priceRange.split('-');
    return { min: parseInt(minStr), max: parseInt(maxStr) };
  }, [priceRange]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await listProductsApi();
        if (mounted) setProducts(data);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load products');
      } finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, []);



  const filtered = useMemo(() => {
    return products.filter(p => {
      if (type && p.type !== type) return false;
      if (size && (!p.sizes || !p.sizes.includes(size))) return false;
      if (priceFilter) {
        const price = Number(p.price || 0);
        if (isNaN(price)) return false;
        if (price < priceFilter.min || price > priceFilter.max) return false;
      }
      if (status) {
        if (status === 'instock' && (!p.stock || p.stock <= 0)) return false;
      }
      return true;
    });
  }, [products, type, size, priceFilter, status]);

  const clearFilters = () => {
    navigate('/shop');
  };

  const hasActiveFilters = type || size || priceRange || status;

  const removeFilter = (filterName) => {
    const newParams = new URLSearchParams(location.search);
    newParams.delete(filterName);
    navigate(`/shop?${newParams.toString()}`);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Featured Products
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
            Discover our carefully curated collection of premium products
          </p>
        </div>

        {/* Active Filters & Result Count */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {type && (
              <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span>Type: {type}</span>
                <button 
                  onClick={() => removeFilter('type')}
                  className="hover:bg-blue-600 rounded-full p-1 transition-all duration-200 transform hover:rotate-90"
                  aria-label="Remove type filter"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}
            {size && (
              <div className="inline-flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span>Size: {size}</span>
                <button 
                  onClick={() => removeFilter('size')}
                  className="hover:bg-purple-600 rounded-full p-1 transition-all duration-200 transform hover:rotate-90"
                  aria-label="Remove size filter"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}
            {priceRange && (
              <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span>Price: ₹{priceRange.replace('-', ' - ₹')}</span>
                <button 
                  onClick={() => removeFilter('price')}
                  className="hover:bg-green-600 rounded-full p-1 transition-all duration-200 transform hover:rotate-90"
                  aria-label="Remove price filter"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}
            {status && (
              <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span>Status: {status === 'instock' ? 'In Stock' : status === 'onsale' ? 'On Sale' : 'Featured'}</span>
                <button 
                  onClick={() => removeFilter('status')}
                  className="hover:bg-orange-600 rounded-full p-1 transition-all duration-200 transform hover:rotate-90"
                  aria-label="Remove status filter"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}
            {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200"
              >
                Clear all filters
              </button>
            )}
          </div>
          <div className="text-gray-600 font-semibold bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Loading amazing products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-red-600 text-lg font-semibold">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {hasActiveFilters 
                ? "Try adjusting your filters to see more products." 
                : "We're updating our collection. Please check back later."
              }
            </p>
            {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filtered.map(p => {
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
                    
                    {/* Quick View Button */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <button className="px-6 py-2 bg-white text-gray-800 rounded-full font-semibold text-sm shadow-lg hover:bg-gray-50 transition-colors duration-300">
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {p.name}
                    </h3>
                    
                    {/* Price & Rating */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-blue-600">₹{p.price}</div>
                      {p.rating && (
                        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
                          <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          <span className="text-sm font-semibold text-orange-600">{p.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className={`inline-flex items-center ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${p.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {p.type && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
                          {p.type}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-2xl transition-all duration-500 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
