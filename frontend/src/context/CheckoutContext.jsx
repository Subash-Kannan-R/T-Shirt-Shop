import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCheckout, updateCheckout as updateCheckoutApi } from '../api/checkout';

const CheckoutContext = createContext();

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider');
  }
  return context;
};

export const CheckoutProvider = ({ children }) => {
  const [checkoutData, setCheckoutDataState] = useState({
    email: '',
    shippingAddress: {
      firstName: '',
      lastName: '',
      company: '',
      country: 'India',
      address: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      phone: ''
    },
    orderNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [checkoutId, setCheckoutId] = useState(null);

  // Load checkout data from database on mount
  useEffect(() => {
    loadCheckout();
  }, []);

  const loadCheckout = async () => {
    try {
      setLoading(true);
      const data = await getCheckout();
      console.log('Loaded checkout data from API:', data);
      if (data) {
        setCheckoutId(data._id);
        const newState = {
          email: data.email || '',
          shippingAddress: data.shippingAddress || {
            firstName: '',
            lastName: '',
            company: '',
            country: 'India',
            address: '',
            apartment: '',
            city: '',
            state: '',
            postalCode: '',
            phone: ''
          },
          orderNotes: data.orderNotes || ''
        };
        console.log('Setting checkout state to:', newState);
        setCheckoutDataState(newState);
      }
    } catch (error) {
      console.error('Failed to load checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  const setCheckoutData = async (data) => {
    try {
      setLoading(true);
      console.log('Updating checkout with data:', data);
      const updated = await updateCheckoutApi(data);
      console.log('API response:', updated);
      setCheckoutId(updated._id);
      
      // Properly merge the data, especially nested shippingAddress
      setCheckoutDataState(prev => {
        const newState = {
          ...prev,
          email: data.email !== undefined ? data.email : prev.email,
          shippingAddress: data.shippingAddress ? {
            ...prev.shippingAddress,
            ...data.shippingAddress
          } : prev.shippingAddress,
          orderNotes: data.orderNotes !== undefined ? data.orderNotes : prev.orderNotes
        };
        console.log('Updated checkout state to:', newState);
        return newState;
      });
    } catch (error) {
      console.error('Failed to update checkout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateShippingAddress = async (address) => {
    const data = {
      shippingAddress: {
        ...checkoutData.shippingAddress,
        ...address
      }
    };
    await setCheckoutData(data);
  };

  const clearCheckoutData = () => {
    setCheckoutDataState({
      email: '',
      shippingAddress: {
        firstName: '',
        lastName: '',
        company: '',
        country: 'India',
        address: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        phone: ''
      },
      orderNotes: ''
    });
    setCheckoutId(null);
  };

  return (
    <CheckoutContext.Provider value={{
      checkoutData,
      setCheckoutData,
      updateShippingAddress,
      clearCheckoutData,
      loadCheckout,
      loading,
      checkoutId
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};
