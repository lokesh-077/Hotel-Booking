import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Users, Wifi, Coffee, Check, Shield } from 'lucide-react';
import BookingForm from './BookingForm';
import ImageCarousel from '../../components/ImageCarousel';

const RoomDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await api.get(`rooms/${id}/`);
                setRoom(res.data);
            } catch (err) {
                console.error("Failed to fetch room", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading details...</div>;
    if (!room) return <div style={{ textAlign: 'center', padding: '4rem' }}>Room not found.</div>;

    const allImages = [
        ...(room.image ? [room.image] : []),
        ...(room.images ? room.images.map(img => img.image) : [])
    ];

    return (
        <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ 
                    height: '400px', 
                    borderRadius: 'var(--radius-lg)', 
                    backgroundColor: '#e2e8f0', 
                    marginBottom: '3rem',
                    overflow: 'hidden'
                }}
            >
                {allImages.length > 0 ? (
                    <ImageCarousel images={allImages} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: 'var(--color-text-light)' }}>
                        No Image Available
                    </div>
                )}
            </motion.div>

            <div className="grid-2-1">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{room.type} Room</h1>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '1.125rem' }}>Room {room.room_number}</p>
                        </div>
                    </div>

                    <p style={{ fontSize: '1.125rem', lineHeight: 1.8, marginBottom: '2.5rem', color: '#4a5568' }}>
                        {room.description}
                    </p>

                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Amenities</h3>
                    <div className="grid-1-1" style={{ marginBottom: '3rem' }}>
                        {room.facilities.map((fac, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4a5568' }}>
                                <Check size={20} color="var(--color-success)" />
                                {fac}
                            </div>
                        ))}
                    </div>

                    <div style={{ background: '#F0F4F8', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <Shield size={24} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                        <div>
                            <h4 style={{ marginBottom: '0.25rem' }}>NS Mahal Guarantee</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', margin: 0 }}>Book securely. Cancel up to 24 hours before check-in for a full refund.</p>
                            <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 0 0', fontWeight: 'bold' }}>
                                <a 
                                    href="https://www.google.com/maps/search/?api=1&query=24,+Jawahar+St,+opp.to+municipal+middle+school,+Adivaram,+South+Anna+Nagar,+Palani,+Tamil+Nadu+624601" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                                >
                                    Address: 24, Jawahar St, opp.to municipal middle school, Adivaram, South Anna Nagar, Palani, Tamil Nadu 624601
                                </a>
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <BookingForm room={room} user={user} />
                </motion.div>
            </div>
        </div>
    );
};

export default RoomDetail;
