import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { CartProvider } from './context/CartContext';

// Shop Pages
import Home from './pages/shop/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Collections from './pages/shop/Collections';
import ProductDetail from './pages/shop/ProductDetail';
import Cart from './pages/shop/Cart';
import Checkout from './pages/shop/Checkout';
import MyOrders from './pages/shop/MyOrders';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
           <CartProvider>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
           {/* --- PUBLIC ROUTES --- */}
<Route path="/" element={<Navigate to="/login" replace />} />
<Route path="/home" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/collections" element={<Collections />} />
<Route path="/product/:id" element={<ProductDetail />} />

          {/* --- USER PROTECTED ROUTES --- */}
          {/* These require a login but any role (user/admin) can access */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/my-orders" element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />

          {/* --- ADMIN ONLY ROUTES --- */}
          {/* These strictly require admin or superadmin roles */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin', 'superadmin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute roles={['admin', 'superadmin']}>
              <AdminProducts />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute roles={['admin', 'superadmin']}>
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin', 'superadmin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />

          {/* --- 404 CATCH ALL --- */}
          {/* Redirects any unknown route back to home or a 404 page */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
            </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;