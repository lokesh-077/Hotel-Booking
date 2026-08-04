import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const BookingSuccess = () => {
    return (
        <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: 'var(--color-surface)',
                    padding: '4rem 2rem',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)',
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '100%'
                }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}
                >
                    <CheckCircle size={80} color="#10B981" />
                </motion.div>
                
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0f172a' }}>Payment Successful!</h1>
                <p style={{ color: 'var(--color-text-light)', fontSize: '1.125rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                    Your booking at NS Mahal has been successfully confirmed. We've sent the details to your email. We look forward to hosting you!
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link to="/my-bookings" className="btn btn-primary" style={{ width: '100%' }}>
                        View My Bookings
                    </Link>
                    <Link to="/" className="btn btn-outline" style={{ width: '100%' }}>
                        Return to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default BookingSuccess;
