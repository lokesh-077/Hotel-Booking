import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ reviewer_name: '', rating: 5, comment: '' });

    const fetchReviews = async () => {
        try {
            const res = await api.get('reviews/');
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('reviews/', formData);
            setFormData({ reviewer_name: '', rating: 5, comment: '' });
            fetchReviews();
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
            alert("Failed to add review: " + errMsg);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this review?")) {
            try {
                await api.delete(`reviews/${id}/`);
                fetchReviews();
            } catch (err) {
                console.error(err);
                alert("Failed to delete review.");
            }
        }
    };

    return (
        <div className="container grid-1-2" style={{ padding: '4rem 1.5rem' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2>Add External Review</h2>
                <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', marginTop: '1.5rem' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Reviewer Name</label>
                            <input type="text" name="reviewer_name" value={formData.reviewer_name} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Rating (1-5)</label>
                            <input type="number" name="rating" min="1" max="5" value={formData.rating} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Comment</label>
                            <textarea name="comment" value={formData.comment} onChange={handleChange} rows="4" required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Review</button>
                    </form>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2>Manage Reviews</h2>
                {loading ? <p>Loading reviews...</p> : (
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                        {reviews.length === 0 ? <p>No reviews found.</p> : reviews.map(review => (
                            <motion.div 
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                            >
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {review.user_detail?.first_name || review.user_detail?.username || review.reviewer_name}
                                        <span style={{ color: '#F59E0B' }}>
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </span>
                                    </h3>
                                    <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic', margin: 0 }}>"{review.comment}"</p>
                                </div>
                                <button onClick={() => handleDelete(review.id)} className="btn btn-outline" style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                                    Delete
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ManageReviews;
