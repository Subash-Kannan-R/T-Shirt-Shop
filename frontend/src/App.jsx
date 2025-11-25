// import Forcollar from "./Components/Forcollar";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AuthForm from "./Components/AuthForm";
import Shop from "./Components/Shop";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Poster from "./Components/Poster";
import Roundneck from "./Components/Roundneck";
import Hoodie from "./Components/Hoodie";
import Home from "./Pages/Home";
import Products from "./Components/Products";
import Wishlist from "./Components/Wishlist";
import ProductDetail from "./Components/ProductDetail";
import Collar from "./Components/Collar";
import { CartProvider } from "./context/CartContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";
import Cart from "./Components/Cart";
import Information from "./Components/Checkout/Information";
import CheckoutShipping from "./Components/Checkout/Shipping";
import CheckoutPayment from "./Components/Checkout/Payment";
import Shipping from "./Order/Shipping";
import Finalcheck from "./Order/Finalcheck";
import Paymentmethod from "./Order/Paymentmethod";
import Invoice from "./Order/Invoice";
import Footer from "./Pages/Footer";
import Dashboard from "./Pages/Dashboard";
import AdminLayout from "./Layouts/AdminLayout";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminProducts from "./Pages/Admin/Products";
import AdminOrders from "./Pages/Admin/Orders";
import AdminUsers from "./Pages/Admin/Users";
import AdminLogin from "./Pages/Admin/Login";
import RequireAdmin from "./Components/RequireAdmin";
import RequireAuth from "./Components/RequireAuth";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <CheckoutProvider>
          <WishlistProvider>
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<><Home /><Roundneck /> <Footer/> </>} />
              <Route path="/shop" element={<><Shop /> <Products /></>} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/poster" element={<Poster />} />
              <Route path="/hoodie" element={<Hoodie />} />
              <Route path="/collar" element={<Collar />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout/information" element={<Information />} />
              <Route path="/checkout/shipping" element={<CheckoutShipping />} />
              <Route path="/checkout/payment" element={<CheckoutPayment />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/finalcheck" element={<Finalcheck />} />
              <Route path="/payment" element={<Paymentmethod />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/login" element={<AuthForm />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Routes>
          </>
          </WishlistProvider>
        </CheckoutProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;