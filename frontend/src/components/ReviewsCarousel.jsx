import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewsCarousel = () => {
    const [reviews, setReviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get('reviews/');
                setReviews(res.data);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            }
        };
        fetchReviews();
    }, []);

    useEffect(() => {
        if (reviews.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 5000); // Slide every 5 seconds
        return () => clearInterval(interval);
    }, [reviews]);

    if (reviews.length === 0) return null;

    return (
        <div style={{ padding: '4rem 1.5rem', textAlign: 'center', background: 'transparent' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', minHeight: '200px' }}>
                <h2 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>What Our Guests Say</h2>
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(255, 255, 255, 0.8)' }}
                    >
                        <div style={{ color: '#F59E0B', fontSize: '1.5rem', marginBottom: '1rem' }}>
                            {'★'.repeat(reviews[currentIndex].rating)}{'☆'.repeat(5 - reviews[currentIndex].rating)}
                        </div>
                        <p style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--color-text)', marginBottom: '1.5rem' }}>
                            "{reviews[currentIndex].comment}"
                        </p>
                        <h4 style={{ color: 'var(--color-primary)', margin: 0 }}>
                            - {reviews[currentIndex].user_detail?.first_name || reviews[currentIndex].user_detail?.username || reviews[currentIndex].reviewer_name || 'Guest'}
                        </h4>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ReviewsCarousel;
