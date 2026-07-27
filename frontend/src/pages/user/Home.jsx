import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import RoomCard from '../../components/RoomCard';
import ReviewsCarousel from '../../components/ReviewsCarousel';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Check, CheckCircle2 } from 'lucide-react';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    
    // Pagination & Filter State
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 10;

    const fetchBookings = async () => {
        try {
            const res = await api.get('bookings/');
            setBookings(res.data);
        } catch (err) {
            console.error("Failed to fetch bookings", err);
        }
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get('rooms/');
                setRooms(res.data);
            } catch (err) {
                console.error("Failed to fetch rooms", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
        
        if (user && user.role === 'admin') {
            fetchBookings();
        }
    }, [user]);

    const handleMarkNoted = async (bookingId) => {
        try {
            await api.post(`bookings/${bookingId}/mark_noted/`);
            fetchBookings();
        } catch (err) {
            console.error("Failed to mark booking as noted", err);
            const errMsg = err.response?.data?.error || err.response?.statusText || err.message;
            alert('Failed to mark as noted: ' + errMsg);
        }
    };

    const handleAdminCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await api.post(`bookings/${bookingId}/cancel_booking/`);
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
        } catch (err) {
            console.error("Failed to cancel booking", err);
            alert('Failed to cancel booking.');
        }
    };

    const filteredBookings = bookings.slice().reverse();

    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

    return (
        <div style={{ paddingBottom: '4rem', position: 'relative' }}>
            {/* 3D Animated Background specific to User Home Page */}
            <div className="bg-3d-wrapper">
                <div className="shape-3d shape-1"></div>
                <div className="shape-3d shape-2"></div>
                <div className="shape-3d shape-3"></div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hero-card hero-card-margin"
                style={{ 
                    padding: '4rem 2rem', 
                    maxWidth: '1000px',
                    background: 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
                }}
            >
                <div className="grid-1-1 hero-flex-mobile-reorder" style={{ alignItems: 'center', gap: '3rem' }}>
                    <div className="hero-image-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
                        <img 
                            src="/palani_murugan.jpg" 
                            alt="Palani Murugan" 
                            style={{ 
                                width: '100%', 
                                maxWidth: '350px', 
                                borderRadius: '16px', 
                                boxShadow: 'var(--shadow-lg)',
                                objectFit: 'cover'
                            }} 
                        />
                    </div>
                    <div className="hero-text-container" style={{ textAlign: 'left' }}>
                        <div className="hero-title-wrapper">
                            <h1 className="hero-title" style={{ 
                                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
                                marginBottom: '1.5rem', 
                                color: '#0f172a',
                                fontFamily: 'var(--font-serif)',
                                letterSpacing: '-1px',
                                lineHeight: 1.1
                            }}>
                                Welcome to <span className="text-gradient">NS Mahal</span>
                            </h1>
                        </div>
                        <div className="hero-subtitle-wrapper">
                            <p className="hero-subtitle" style={{ 
                                fontSize: 'clamp(1rem, 4vw, 1.35rem)', 
                                color: '#334155', 
                                fontWeight: 500,
                                lineHeight: 1.6
                            }}>
                                Where devotion meets comfort, and every stay feels peaceful and blessed.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="container" style={{ marginTop: '3rem' }}>
                {user && user.role === 'admin' ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h2>Recent Bookings</h2>
                        </div>
                        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: 'var(--color-bg)' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Name</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Room Number</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Room Type</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Check-in</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Check-out</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentBookings.map(b => (
                                        <tr key={b.id}>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>{b.user_detail?.first_name || b.user_detail?.username}</td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>{b.room_detail?.room_number}</td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>{b.room_detail?.type}</td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>{b.check_in}</td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>{b.check_out}</td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                                                {b.status === 'cancelled' ? (
                                                    <span style={{ color: 'var(--color-error)', fontWeight: 600, fontSize: '0.9rem', padding: '0.4rem', display: 'inline-block' }}>
                                                        Cancelled {b.cancelled_by ? `(by ${b.cancelled_by === 'admin' ? 'Admin' : 'User'})` : ''}
                                                    </span>
                                                ) : (
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button 
                                                            onClick={() => handleMarkNoted(b.id)}
                                                            className="btn"
                                                            style={{
                                                                padding: '0.4rem 0.75rem',
                                                                borderRadius: 'var(--radius-md)',
                                                                background: b.is_noted ? '#D1FAE5' : 'transparent',
                                                                color: b.is_noted ? '#065F46' : 'var(--color-text-light)',
                                                                border: b.is_noted ? '1px solid #10B981' : '1px solid var(--color-border)',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '0.25rem',
                                                                fontSize: '0.8rem',
                                                                fontWeight: 600
                                                            }}
                                                        >
                                                            {b.is_noted ? (
                                                                <><CheckCircle2 size={16} /> Noted</>
                                                            ) : (
                                                                <><Check size={16} /> Mark</>
                                                            )}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAdminCancel(b.id)}
                                                            className="btn btn-outline"
                                                            style={{
                                                                padding: '0.4rem 0.75rem',
                                                                fontSize: '0.8rem',
                                                                borderColor: 'var(--color-error)',
                                                                color: 'var(--color-error)'
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredBookings.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>No bookings found.</p>}
                            
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Previous</button>
                                    <span style={{ fontWeight: 500, color: 'var(--color-text-light)' }}>Page {currentPage} of {totalPages}</span>
                                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Next</button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="hero-features-container" style={{ marginBottom: '2.5rem', justifyContent: 'center' }}>
                            {['Rooms', 'Car Parking', 'Tickets for Dharisanam and Winch-car', 'Door step Food'].map((feature, index) => (
                                <span key={index} style={{
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    color: 'var(--color-primary)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    ✨ {feature}
                                </span>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h2>Our Rooms</h2>
                        </div>

                        {loading ? <p>Loading rooms...</p> : (
                            <div className="grid-auto">
                                {rooms.map(room => (
                                    <RoomCard key={room.id} room={room} />
                                ))}
                                {rooms.length === 0 && <p>No rooms available.</p>}
                            </div>
                        )}
                    </>
                )}
            </div>

            <ReviewsCarousel />
        </div>
    );
};

export default Home;
