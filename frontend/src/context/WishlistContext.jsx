import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify([...wishlist]));
  }, [wishlist]);

  const addToWishlist = (productId) => {
    setWishlist(prev => new Set(prev).add(productId));
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  const toggleWishlist = (productId) => {
    if (wishlist.has(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const isInWishlist = (productId) => wishlist.has(productId);

  const value = {
    wishlist: [...wishlist],
    wishlistCount: wishlist.size,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
