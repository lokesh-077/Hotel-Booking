import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewingBookingId, setReviewingBookingId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const fetchBookings = async () => {
        try {
            const res = await api.get('bookings/');
            // Only show bookings that have been paid/confirmed or explicitly cancelled
            const validBookings = res.data.filter(b => b.status !== 'pending');
            setBookings(validBookings);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId, paymentMode) => {
        try {
            await api.post(`bookings/${bookingId}/cancel_booking/`);
            alert('Booking Cancelled. Your payment will be refunded as soon as possible.');
            fetchBookings(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Failed to cancel booking.');
        }
    };

    const submitReview = async (bookingId) => {
        if (!comment.trim()) {
            alert("Please enter a description for your review.");
            return;
        }
        try {
            await api.post('reviews/', {
                booking: bookingId,
                rating: rating,
                comment: comment
            });
            alert('Thank you for your review!');
            setReviewingBookingId(null);
            setRating(5);
            setComment('');
            fetchBookings();
        } catch (err) {
            console.error(err);
            if (err.response?.data?.booking) {
                alert("You have already reviewed this booking.");
            } else {
                alert('Failed to submit review.');
            }
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ fontSize: '2.5rem', marginBottom: '2rem' }}
            >
                My Bookings
            </motion.h1>

            {loading ? (
                <p>Loading your trips...</p>
            ) : bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ fontSize: '1.125rem', color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>You have no bookings yet.</p>
                    <Link to="/" className="btn btn-primary">Discover Rooms</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {bookings.map((booking, index) => (
                        <div key={booking.id} style={{ display: 'flex', flexDirection: 'column' }}>
                        {(() => {
                            const checkInDate = new Date(booking.check_in);
                            checkInDate.setHours(0, 0, 0, 0);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const isCheckInReached = today >= checkInDate;
                            
                            return (
                                <>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    style={{ 
                                        background: 'var(--color-surface)', 
                                        padding: '1.5rem', 
                                        borderRadius: 'var(--radius-md)',
                                        boxShadow: 'var(--shadow-sm)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{booking.room_detail?.type} Room</h3>
                                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                                    Check-in: {booking.check_in} | Check-out: {booking.check_out}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                                    ₹{booking.total_price}
                                </div>
                                
                                {booking.status !== 'pending' && (
                                    <span style={{ 
                                        display: 'inline-block', 
                                        padding: '0.4rem 1rem', 
                                        background: booking.status === 'confirmed' ? 'var(--color-success)' : (booking.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7'), 
                                        color: booking.status === 'confirmed' ? 'white' : (booking.status === 'cancelled' ? '#991B1B' : '#92400E'),
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        boxShadow: booking.status === 'confirmed' ? '0 4px 6px rgba(56, 161, 105, 0.2)' : 'none'
                                    }}>
                                        {booking.status}
                                    </span>
                                )}

                                {(booking.status === 'pending' || booking.status === 'confirmed') && !isCheckInReached && (
                                    <button 
                                        onClick={() => handleCancel(booking.id, booking.payment_mode)} 
                                        className="btn btn-outline" 
                                        style={{ padding: '0.25rem 1rem', fontSize: '0.8rem', marginTop: '0.5rem', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                                {booking.status === 'confirmed' && !booking.has_review && isCheckInReached && (
                                    <button 
                                        onClick={() => {setReviewingBookingId(booking.id); setRating(5); setComment('');}} 
                                        className="btn btn-outline" 
                                        style={{ padding: '0.25rem 1rem', fontSize: '0.8rem', marginTop: '0.25rem' }}
                                    >
                                        Leave a Review
                                    </button>
                                )}
                                {booking.status === 'confirmed' && booking.has_review && isCheckInReached && (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.5rem' }}>✓ Reviewed</span>
                                )}
                            </div>
                        </motion.div>
                        {reviewingBookingId === booking.id && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ background: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginTop: '-0.5rem', marginBottom: '1rem' }}
                            >
                                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Rate your stay</h4>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span 
                                            key={star} 
                                            onClick={() => setRating(star)}
                                            style={{ cursor: 'pointer', fontSize: '2rem', lineHeight: '1', color: star <= rating ? '#F59E0B' : '#D1D5DB', transition: 'color 0.2s' }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <textarea 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about your experience..."
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '1rem', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => submitReview(booking.id)} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Submit Review</button>
                                    <button onClick={() => setReviewingBookingId(null)} className="btn btn-outline" style={{ padding: '0.5rem 1.5rem' }}>Cancel</button>
                                </div>
                            </motion.div>
                        )}
                        </>
                        );
                        })()}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
