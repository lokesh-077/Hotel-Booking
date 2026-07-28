import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { User, LogOut, Hotel, Phone, BedDouble, CalendarCheck, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useContext(CartContext);
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <motion.nav 
            className="glass"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0,
                height: '5rem',
                display: 'flex',
                alignItems: 'center',
                zIndex: 1000
            }}
        >
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                        src="/palani_murugan.jpg" 
                        alt="NS Mahal Logo" 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', boxShadow: 'var(--shadow-sm)' }} 
                    />
                    <h2 className="text-gradient nav-logo-text" style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '-0.02em', fontWeight: 700 }}>NS Mahal, Palani</h2>
                </Link>

                <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {(!user || user.role !== 'admin') && (
                        <>

                            <a href="tel:+917010276853" className="btn btn-primary desktop-only" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Call Admin">
                                <Phone size={20} />
                            </a>

                            {user && (
                                <Link to="/cart" className="btn btn-primary nav-btn-icon btn-mobile-clear" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BedDouble size={20} />
                                    {cart.length > 0 && (
                                        <span style={{ 
                                            background: 'white', color: 'var(--color-primary)', 
                                            borderRadius: '50%', padding: '0.1rem 0.5rem', 
                                            fontSize: '0.8rem', fontWeight: 'bold' 
                                        }}>
                                            {cart.length}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </>
                    )}
                    
                    {user ? (
                        <>
                            {user.role !== 'admin' && user.bookings_count > 0 && (
                                <Link to="/my-bookings" className="btn btn-primary nav-btn-icon btn-mobile-clear" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }} title="My Bookings">
                                    <CalendarCheck size={20} />
                                </Link>
                            )}
                            {user.role === 'admin' && (
                                <Link to="/admin" style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.9rem' }}>Admin Panel</Link>
                            )}
                            <div className="nav-user-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem', borderLeft: '1px solid var(--color-border)', paddingLeft: '1rem' }}>
                                <span className="nav-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                                    <User size={18} />
                                    {user.first_name || user.username}
                                </span>
                            </div>
                            <button onClick={logout} className="btn btn-primary btn-mobile-clear" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }}>
                                <LogOut size={20} />
                                <span className="desktop-only" style={{ marginLeft: '0.5rem' }}>Logout</span>
                            </button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Link to="/auth" className="btn btn-primary btn-mobile-clear" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }}>
                                <User size={20} />
                                <span className="desktop-only" style={{ marginLeft: '0.5rem' }}>Sign Up / Login</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
