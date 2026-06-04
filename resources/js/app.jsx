import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import FeedPage from './pages/FeedPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import '../css/app.css';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <p className="text-center py-20 text-gray-400">Chargement...</p>;
    return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/"          element={<HomePage />} />
                <Route path="/shop"      element={<ShopPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/feed"      element={<FeedPage />} />
                <Route path="/login"     element={<LoginPage />} />
                <Route path="/register"        element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/cart"      element={<PrivateRoute><CartPage /></PrivateRoute>} />
                <Route path="/orders"    element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
            </Routes>
        </>
    );
}

createRoot(document.getElementById('app')).render(
    <BrowserRouter>
        <AuthProvider>
            <CartProvider>
                <AppRoutes />
            </CartProvider>
        </AuthProvider>
    </BrowserRouter>
);