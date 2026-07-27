import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, BedDouble, Check } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

const BookingForm = ({ room, user }) => {
    const navigate = useNavigate();
    const { cart, addToCart } = useContext(CartContext);
    const [formData, setFormData] = useState({
        check_in: '',
        check_out: '',
        adults: 1,
        children: 0
    });
    const [totalPrice, setTotalPrice] = useState(room.price_per_night);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (formData.check_in && formData.check_out) {
            const start = new Date(formData.check_in);
            const end = new Date(formData.check_out);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 0) {
                setTotalPrice(room.price_per_night * diffDays);
            } else {
                setTotalPrice(room.price_per_night);
            }
        }
    }, [formData, room.price_per_night]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        
        if (cart.some(item => item.room === room.id)) {
            setError('This room is already in your cart.');
            return;
        }

        if (!formData.check_in || !formData.check_out) {
            setError('Please select both check-in and check-out dates.');
            return;
        }

        if (new Date(formData.check_in) > new Date(formData.check_out)) {
            setError('Check-out date cannot be before check-in date.');
            return;
        }

        const totalGuests = parseInt(formData.adults) + parseInt(formData.children);
        if (totalGuests > room.capacity) {
            setError(`This room can only accommodate up to ${room.capacity} guests in total.`);
            return;
        }

        addToCart({
            room: room.id,
            room_type: room.type,
            check_in: formData.check_in,
            check_out: formData.check_out,
            adults: formData.adults,
            children: formData.children,
            total_price: totalPrice
        });
        
        alert("Room added to cart successfully!");
    };

    const handleBookNow = (e) => {
        e.preventDefault();
        
        if (cart.some(item => item.room === room.id)) {
            setError('This room is already in your cart.');
            return;
        }

        if (!formData.check_in || !formData.check_out) {
            setError('Please select both check-in and check-out dates.');
            return;
        }
        
        if (new Date(formData.check_in) > new Date(formData.check_out)) {
            setError('Check-out date cannot be before check-in date.');
            return;
        }

        const totalGuests = parseInt(formData.adults) + parseInt(formData.children);
        if (totalGuests > room.capacity) {
            setError(`This room can only accommodate up to ${room.capacity} guests in total.`);
            return;
        }

        addToCart({
            room: room.id,
            room_type: room.type,
            check_in: formData.check_in,
            check_out: formData.check_out,
            adults: formData.adults,
            children: formData.children,
            total_price: totalPrice
        });
        
        navigate('/cart');
    };

    return (
        <div style={{ 
            background: 'var(--color-surface)', 
            padding: '2rem', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '7rem'
        }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>₹{room.price_per_night}</span>
                <span style={{ color: 'var(--color-text-light)' }}>/ night</span>
            </div>

            {!user ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <p style={{ marginBottom: '1.5rem' }}>Log in to book this amazing room.</p>
                    <Link to="/auth" className="btn btn-primary" style={{ width: '100%' }}>Sign In to Book</Link>
                </div>
            ) : (
                <form>
                    {error && <p style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
                    
                    <div className="grid-1-1">
                        <div className="input-group">
                            <label>Check-in</label>
                            <input type="date" name="check_in" value={formData.check_in} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="input-group">
                            <label>Check-out</label>
                            <input type="date" name="check_out" value={formData.check_out} onChange={handleChange} required min={formData.check_in || new Date().toISOString().split('T')[0]} />
                        </div>
                    </div>

                    <div className="grid-1-1">
                        <div className="input-group">
                            <label>Adults</label>
                            <select name="adults" value={formData.adults} onChange={handleChange}>
                                {[...Array(room.capacity).keys()].map(n => (
                                    <option key={n+1} value={n+1}>{n+1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Children</label>
                            <select name="children" value={formData.children} onChange={handleChange}>
                                {[...Array(room.capacity).keys()].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '1.5rem 0', 
                        borderTop: '1px solid var(--color-border)',
                        marginTop: '0.5rem',
                        fontWeight: 600,
                        fontSize: '1.125rem'
                    }}>
                        <span>Total Price</span>
                        <span>₹{totalPrice}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" onClick={handleAddToCart} className="btn btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                <BedDouble size={20} /> Add to Cart
                            </button>
                            <button type="button" onClick={handleBookNow} className="btn btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                <Check size={20} /> Book Now
                            </button>
                        </div>
                        
                        <a href="tel:+917010276853" className="btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none' }} title="Make a call for queries and available vacancy">
                            <Phone size={28} className="animate-ring" />
                        </a>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BookingForm;
