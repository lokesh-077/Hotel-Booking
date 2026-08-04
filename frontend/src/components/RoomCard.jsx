import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Wifi, Coffee } from 'lucide-react';

const RoomCard = ({ room, index }) => {
    const allImages = [
        ...(room.image ? [room.image] : []),
        ...(room.images ? room.images.map(img => img.image) : [])
    ];
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (e) => {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <motion.div 
            className="room-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column'
            }}
            whileHover={{ y: -5, boxShadow: 'var(--shadow-md)' }}
        >
            <div style={{ height: '220px', backgroundColor: '#e2e8f0', position: 'relative' }}>
                {allImages.length > 0 ? (
                    <>
                        <img 
                            src={allImages[currentImageIndex]} 
                            alt={room.type} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        {allImages.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
                                >
                                    &#10094;
                                </button>
                                <button 
                                    onClick={nextImage}
                                    style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
                                >
                                    &#10095;
                                </button>
                                
                                <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px', zIndex: 2 }}>
                                    {allImages.map((_, i) => (
                                        <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === currentImageIndex ? 'white' : 'rgba(255,255,255,0.4)' }} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)' }}>
                        No Image Available
                    </div>
                )}
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--color-surface)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem' }}>
                    ₹{room.price_per_night} / night
                </div>
            </div>
            
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{room.type} Room</h3>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                    {room.description.substring(0, 100)}...
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={16} /> {room.capacity}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Wifi size={16} /> Wifi</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Coffee size={16} /></span>
                </div>
                
                <Link to={`/room/${room.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    View Details
                </Link>
            </div>
        </motion.div>
    );
};

export default RoomCard;
