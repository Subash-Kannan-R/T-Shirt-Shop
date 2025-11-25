import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getProductApi } from "../utils/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [mainIdx, setMainIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getProductApi(id);
        if (mounted) {
          setProduct(data);
        }
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load product');
      } finally { 
        if (mounted) setLoading(false); 
      }
    };
    if (id) {
      load();
    } else {
      setError('No product ID provided');
      setLoading(false);
    }
    return () => { mounted = false; };
  }, [id]);

  const gallery = useMemo(() => (product?.images && product.images.length ? product.images.slice(0,5) : []), [product]);

  const handleQuantityChange = (increment) => {
    setQuantity(prev => Math.max(1, prev + increment));
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      id: product._id,
      name: product.name,
      price: Number(product.price) || 0,
      image: gallery[0] || '',
      images: gallery,
      size: selectedSize
    };
    addToCart(cartItem, quantity);
    showToast('Added to cart successfully!', 'success');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Safe getters for product properties
  const getProductName = () => {
    if (!product) return 'Product';
    if (typeof product.name === 'string') return product.name;
    if (product.name && typeof product.name === 'object') return product.name.name || 'Product';
    return 'Product';
  };

  const getProductCategory = () => {
    if (!product) return '';
    if (typeof product.category === 'string') return product.category;
    if (product.category && typeof product.category === 'object') return product.category.name || '';
    return '';
  };

  const getProductDescription = () => {
    if (!product) return "Premium quality product crafted with attention to detail and exceptional materials.";
    if (typeof product.description === 'string') return product.description;
    return "Premium quality product crafted with attention to detail and exceptional materials.";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Product</h3>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button 
            onClick={() => navigate('/shop')} 
            className="bg-gray-900 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
          <p className="text-gray-500 text-sm mb-6">The requested product is no longer available.</p>
          <button 
            onClick={() => navigate('/shop')} 
            className="bg-gray-900 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Professional Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button onClick={() => navigate('/')} className="bg-transparent hover:text-gray-700 transition-colors">
                Home
              </button>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
            </li>
            <li>
              <button onClick={() => navigate('/shop')} className="bg-transparent hover:text-gray-700 transition-colors">
                Shop
              </button>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 font-medium">
              {getProductName()}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Professional Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-50 rounded-lg overflow-hidden group">
              {gallery[mainIdx] ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  <img 
                    src={gallery[mainIdx]} 
                    alt={getProductName()}
                    className={`w-full h-[500px] object-cover transition-opacity duration-300 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setImageLoading(false)}
                  />
                </>
              ) : (
                <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image not available</span>
                </div>
              )}
              
              {/* Professional Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {discount > 0 && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold tracking-wide">
                    SAVE {discount}%
                  </span>
                )}
                <span className={`${
                  (product?.stock ?? 0) > 0 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-white'
                } px-3 py-1 rounded text-xs font-semibold tracking-wide`}>
                  {(product?.stock ?? 0) > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                </span>
              </div>

              {/* Image Navigation */}
              {gallery.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {gallery.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setMainIdx(i)}
                      className={`bg-transparent w-2 h-2 rounded-full transition-colors ${
                        mainIdx === i ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {gallery.length > 1 && (
              <div className="flex space-x-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainIdx(i)}
                    className={`bg-transparent flex-1 h-20 bg-gray-50 rounded border-2 transition-all ${
                      mainIdx === i 
                        ? 'border-gray-900 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    } overflow-hidden`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${i + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-gray-400 text-lg">🚚</div>
                  <p className="text-xs text-gray-600 font-medium">Free Shipping</p>
                  <p className="text-xs text-gray-400">Orders over ₹500</p>
                </div>
                <div className="space-y-2">
                  <div className="text-gray-400 text-lg">↩️</div>
                  <p className="text-xs text-gray-600 font-medium">Easy Returns</p>
                  <p className="text-xs text-gray-400">30-day policy</p>
                </div>
                <div className="space-y-2">
                  <div className="text-gray-400 text-lg">✓</div>
                  <p className="text-xs text-gray-600 font-medium">Quality Assured</p>
                  <p className="text-xs text-gray-400">Premium materials</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Product Info */}
          <div className="space-y-8">
            {/* Product Header */}
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2 tracking-tight">
                {getProductName()}
              </h1>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-semibold text-gray-900">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                  {discount > 0 && (
                    <span className="text-green-600 text-sm font-medium">Save {discount}%</span>
                  )}
                </>
              )}
            </div>

            {/* Size Selection */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="bg-transparent text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
                >
                  Size guide
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`bg-transparent py-3 border rounded text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-gray-900 bg-transparent text-gray-900'
                        : 'bg-transparent border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="border-t border-gray-200 pt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="bg-transparent w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-light">−</span>
                  </button>
                  <span className="w-12 text-center text-base font-medium">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="bg-transparent w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-light">+</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                  className="flex-1 bg-transparent border border-gray-900 text-gray-900 py-3 px-6 rounded text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={!product.stock}
                  className="flex-1 bg-white border border-gray-900 text-gray-900 py-3 px-6 rounded text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Product Details */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">Product Details</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-3">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    </span>
                    <span>Premium quality materials and craftsmanship</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    </span>
                    <span>Designed for comfort and durability</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    </span>
                    <span>Eco-friendly and sustainable materials</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Instructions</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-3">
                    <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    </span>
                    <span>Machine wash cold with similar colors</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    </span>
                    <span>Tumble dry low or air dry</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    </span>
                    <span>Iron on low heat if needed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Size Guide</h2>
                <button 
                  onClick={() => setShowSizeGuide(false)}
                  className="bg-transparent text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-3 text-left font-semibold text-gray-900 text-xs uppercase tracking-wide">SIZE</th>
                      <th className="border p-3 text-left font-semibold text-gray-900 text-xs uppercase tracking-wide">CHEST</th>
                      <th className="border p-3 text-left font-semibold text-gray-900 text-xs uppercase tracking-wide">LENGTH</th>
                      <th className="border p-3 text-left font-semibold text-gray-900 text-xs uppercase tracking-wide">SLEEVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['XS', '34-36"', '26"', '15.5"'],
                      ['S', '36-38"', '27"', '16"'],
                      ['M', '38-40"', '28"', '16.5"'],
                      ['L', '40-42"', '29"', '17"'],
                      ['XL', '42-44"', '30"', '17.5"'],
                      ['XXL', '44-46"', '31"', '18"'],
                    ].map(([size, chest, length, sleeve]) => (
                      <tr key={size} className="hover:bg-gray-50 transition-colors">
                        <td className="border p-3 font-medium text-gray-900">{size}</td>
                        <td className="border p-3 text-gray-600">{chest}</td>
                        <td className="border p-3 text-gray-600">{length}</td>
                        <td className="border p-3 text-gray-600">{sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 text-center">
                  All measurements are in inches and approximate. For the perfect fit, compare with your favorite garment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;