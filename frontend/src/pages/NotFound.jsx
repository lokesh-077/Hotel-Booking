import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    maxWidth: '520px',
                    width: '100%',
                    background: 'var(--color-surface)',
                    padding: '3.5rem 2rem',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)',
                    textAlign: 'center',
                    border: '1px solid var(--color-border)'
                }}
            >
                <div style={{ fontSize: '5.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '1rem' }}>
                    404
                </div>
                <h1 style={{ fontSize: '1.85rem', marginBottom: '0.75rem', color: 'var(--color-text)' }}>
                    Page Not Found
                </h1>
                <p style={{ color: 'var(--color-text-light)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                    Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem' }}>
                        <Home size={18} />
                        Back to Home
                    </Link>
                    <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem' }}>
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
