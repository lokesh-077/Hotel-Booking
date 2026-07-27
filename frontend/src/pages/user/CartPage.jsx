import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, CreditCard, Banknote } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CartPage = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const [paymentMode, setPaymentMode] = useState('online');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Guest Details
    const [address, setAddress] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [aadharPhoto, setAadharPhoto] = useState(null);
    
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !mobileNumber) {
            setMobileNumber(user.phone || user.username || '');
        }
    }, [user]);

    const totalPrice = cart.reduce((sum, item) => sum + Number(item.total_price), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        
        if (!user) {
            navigate('/auth?redirect=/cart');
            return;
        }

        if (!address.trim() || !mobileNumber.trim() || !aadharNumber.trim() || !aadharPhoto) {
            setError('Please fill out your Address, Mobile Number, Aadhar Number, and upload Aadhar Photo.');
            return;
        }
        if (aadharNumber.length !== 12) {
            setError('Aadhar Number must be exactly 12 digits.');
            return;
        }
        if (mobileNumber.length !== 10) {
            setError('Mobile Number must be exactly 10 digits.');
            return;
        }

        setError('');

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('items', JSON.stringify(cart));
            formData.append('payment_mode', paymentMode);
            formData.append('address', address);
            formData.append('mobile_number', mobileNumber);
            formData.append('aadhar_number', aadharNumber);
            formData.append('aadhar_photo', aadharPhoto);

            const res = await api.post('bookings/checkout_cart/', formData);
            const orderGroupId = res.data.order_group_id;
            clearCart();
            navigate(`/bill/${orderGroupId}`);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || err.message;
            alert('Failed to checkout: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', minHeight: '60vh' }}>
                <h2>Your Cart is Empty</h2>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>Looks like you haven't added any rooms yet.</p>
                <button onClick={() => navigate('/')} className="btn btn-primary">Browse Rooms</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '6rem 1.5rem', minHeight: '60vh' }}>
            <h1 style={{ marginBottom: '2rem' }}>Your Cart</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div>
                    {cart.map((item, index) => (
                        <div key={index} style={{ 
                            background: 'white', 
                            padding: '1.5rem', 
                            borderRadius: '12px', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            marginBottom: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-primary)' }}>{item.room_type}</h3>
                                <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                                    {item.check_in} to {item.check_out}
                                </p>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                                    {item.adults} Adults, {item.children} Children
                                </p>
                                <p style={{ margin: '0.5rem 0 0 0', fontWeight: 600, fontSize: '1.1rem' }}>
                                    ₹{item.total_price}
                                </p>
                            </div>
                            <button 
                                onClick={() => removeFromCart(index)}
                                style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ 
                    background: 'var(--color-surface)', 
                    padding: '2rem', 
                    borderRadius: '12px', 
                    boxShadow: 'var(--shadow-md)',
                    height: 'fit-content',
                    position: 'sticky',
                    top: '6rem'
                }}>
                    <h2 style={{ margin: '0 0 1.5rem 0' }}>Booking Summary</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
                        <span>Total Bookings</span>
                        <span>{cart.length}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        <span>Total Price</span>
                        <span>₹{totalPrice}</span>
                    </div>

                    <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Guest Details</h3>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: 600 }}>Address *</label>
                            <textarea 
                                value={address} 
                                onChange={e => setAddress(e.target.value)} 
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit', resize: 'vertical', minHeight: '60px' }}
                                placeholder="Enter your full address"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: 600 }}>Mobile Number *</label>
                            <input 
                                type="tel"
                                value={mobileNumber} 
                                onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ''))} 
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                                placeholder="e.g. 9876543210"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: 600 }}>Aadhar Number *</label>
                            <input 
                                type="text"
                                maxLength="12"
                                value={aadharNumber} 
                                onChange={e => setAadharNumber(e.target.value.replace(/\D/g, ''))} 
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                                placeholder="12-digit Aadhar Number"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: 600 }}>Aadhar Photo *</label>
                            <input 
                                type="file" 
                                onChange={e => setAadharPhoto(e.target.files[0])} 
                                required
                                accept="image/*,.pdf"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleCheckout} 
                        className="btn btn-primary" 
                        disabled={loading}
                        style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <CreditCard size={20} />
                        {loading ? 'Processing...' : 'Confirm Book'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
