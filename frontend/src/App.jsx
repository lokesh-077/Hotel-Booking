import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/user/Home';
import CartPage from './pages/user/CartPage';
import RoomDetail from './pages/user/RoomDetail';
import BillPage from './pages/user/BillPage';
import AuthPage from './pages/auth/AuthPage';
import MyBookings from './pages/user/MyBookings';
import LegalPage from './pages/LegalPage';
import AdminDashboard from './pages/admin/Dashboard';
import ManageRooms from './pages/admin/ManageRooms';
import ManageSettings from './pages/admin/ManageSettings';
import ManageReviews from './pages/admin/ManageReviews';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="page-wrapper">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/room/:id" element={<RoomDetail />} />
                            <Route path="/bill/:id" element={<BillPage />} />
                            <Route path="/my-bookings" element={<MyBookings />} />
                            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                            <Route path="/admin/rooms" element={<AdminRoute><ManageRooms /></AdminRoute>} />
                            <Route path="/admin/settings" element={<AdminRoute><ManageSettings /></AdminRoute>} />
                            <Route path="/admin/reviews" element={<AdminRoute><ManageReviews /></AdminRoute>} />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/legal/:type" element={<LegalPage />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
