import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { listProductsApi } from "../utils/api";

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user, logout } = useAuth();
  const [productNames, setProductNames] = useState([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listProductsApi();
        if (mounted) setProductNames(data.map(p => p.name).filter(Boolean));
      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const results = productNames.filter((name) =>
    name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative z-60">
            <AuthForm onClose={() => setShowAuth(false)} />
          </div>
        </div>
      )}
      
      <nav className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile: Hamburger on left */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo - centered on mobile, left on desktop */}
            <div className="flex items-center md:flex-none flex-1 justify-center md:justify-start">
              <NavLink to="/" className="flex items-center">
                <span className="bg-red-400 text-white text-xl sm:text-2xl font-bold px-3 sm:px-4 py-2 rounded mr-2">T-SHIRT</span>
                <span className="text-xl sm:text-2xl font-bold text-gray-700 tracking-wide">CORNER</span>
              </NavLink>
            </div>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex space-x-10 text-lg font-medium">
              <li>
                <NavLink to="/" end className={({ isActive }) => isActive ? "text-black underline underline-offset-4 decoration-2 decoration-black" : "text-black hover:underline"}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/shop" className={({ isActive }) => isActive ? "text-black underline underline-offset-4 decoration-2 decoration-black" : "text-black hover:underline"}>Shop</NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => isActive ? "text-black underline underline-offset-4 decoration-2 decoration-black" : "text-black hover:underline"}>About Us</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => isActive ? "text-black underline underline-offset-4 decoration-2 decoration-black" : "text-black hover:underline"}>Contact Us</NavLink>
              </li>
              <li>
                <NavLink to={user?.role === 'admin' ? "/admin" : "/dashboard"} className={({ isActive }) => isActive ? "text-black underline underline-offset-4 decoration-2 decoration-black flex items-center gap-2" : "text-black hover:underline flex items-center gap-2"} aria-label="Dashboard">
                  <span className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-700">
                      <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h2a5 5 0 0110 0h2c0-3.866-3.134-7-7-7z" />
                    </svg>
                  </span>
                </NavLink>
              </li>
            </ul>

            {/* Right side icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Login/Logout - hidden on mobile */}
              {!user ? (
                <button
                  className="hidden md:flex items-center text-gray-700 hover:text-black text-base font-medium bg-transparent"
                  onClick={() => setShowAuth(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                  </svg>
                  <span className="hidden lg:inline">Login / Register</span>
                </button>
              ) : (
                <button
                  className="hidden md:flex items-center text-gray-700 hover:text-black text-base font-medium bg-transparent"
                  onClick={() => { logout(); navigate('/'); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  <span className="hidden lg:inline">Logout</span>
                </button>
              )}

              {/* Cart Icon */}
              <NavLink to="/cart" className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700 hover:text-black">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </NavLink>

              {/* Heart Icon - hidden on small mobile */}
              <NavLink to="/wishlist" className="relative hidden sm:block text-gray-700 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.239-4.5-5-4.5-1.657 0-3.156.832-4 2.09C10.156 4.582 8.657 3.75 7 3.75c-2.761 0-5 2.015-5 4.5 0 7.25 10 12.5 10 12.5s10-5.25 10-12.5z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>

              {/* Refresh Icon - hidden on small mobile */}
              <button
                onClick={() => {
                  if (isRefreshing) return;
                  setIsRefreshing(true);
                  setTimeout(() => setIsRefreshing(false), 2000);
                }}
                aria-label="Refresh"
                className="hidden sm:block p-1 bg-transparent rounded focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0113.5-4.5m0 0V3.75m0 3.75h-3.75M19.5 12a7.5 7.5 0 01-13.5 4.5m0 0v3.75m0-3.75h3.75" />
                </svg>
              </button>

              {/* Search Icon */}
              <button className="p-1 bg-transparent hover:bg-transparent focus:outline-none" onClick={() => { setShowSearch(true); setQuery(""); }} aria-label="Open search">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <ul className="space-y-2">
                <li>
                  <NavLink 
                    to="/" 
                    end 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `block px-4 py-2 rounded-md ${isActive ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/shop" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `block px-4 py-2 rounded-md ${isActive ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    Shop
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/about" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `block px-4 py-2 rounded-md ${isActive ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/contact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `block px-4 py-2 rounded-md ${isActive ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    Contact Us
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to={user?.role === 'admin' ? "/admin" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `block px-4 py-2 rounded-md ${isActive ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="border-t border-gray-200 pt-2 mt-2">
                  {!user ? (
                    <button
                      onClick={() => { setShowAuth(true); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                      </svg>
                      Login / Register
                    </button>
                  ) : (
                    <button
                      onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      Logout
                    </button>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {showSearch && (
        <div className="bg-white rounded-lg w-full max-w-3xl p-6 mx-auto mt-4">
          <div className="flex items-center gap-4">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 border rounded px-4 py-3"
            />
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowSearch(false)}>Close</button>
          </div>

          <div className="mt-4 max-h-80 overflow-auto">
            {query.trim() === "" ? (
              <div className="text-gray-500">Type to search products</div>
            ) : results.length === 0 ? (
              <div className="text-gray-500">No products found</div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((name, idx) => (
                  <li key={idx} className="p-3 border rounded hover:bg-gray-50 cursor-pointer" onClick={() => { setShowSearch(false); navigate(`/shop`); }}>
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {isRefreshing && (
        <div className="fixed inset-0 z-40 bg-white bg-opacity-90 flex items-start justify-center p-8">
          <div className="w-full max-w-5xl">
            <div className="space-y-6">
              <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
              <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
