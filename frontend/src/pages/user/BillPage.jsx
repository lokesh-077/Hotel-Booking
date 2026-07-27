import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Phone, QrCode } from 'lucide-react';
import api from '../../services/api';
import { motion } from 'framer-motion';

const BillPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderGroup, setOrderGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [payLoading, setPayLoading] = useState(false);

    useEffect(() => {
        const fetchOrderGroup = async () => {
            try {
                const res = await api.get(`bookings/order-groups/${id}/`);
                setOrderGroup(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load bill details. It might not exist.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderGroup();
    }, [id]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayNow = async () => {
        setPayLoading(true);
        try {
            const resScript = await loadRazorpayScript();
            if (!resScript) {
                alert('Razorpay SDK failed to load. Are you online?');
                setPayLoading(false);
                return;
            }

            const orderRes = await api.post('payments/create_razorpay_order/', { order_group_id: orderGroup.id });
            const { razorpay_order_id, amount, currency, razorpay_key_id } = orderRes.data;

            const options = {
                key: razorpay_key_id,
                amount: amount,
                currency: currency,
                name: "NS Mahal",
                description: `Booking for ${orderGroup.bookings.length} Room(s)`,
                order_id: razorpay_order_id,
                handler: async function (response) {
                    try {
                        await api.post('payments/verify_payment/', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        alert('Payment successful! Booking confirmed.');
                        navigate('/my-bookings');
                    } catch (err) {
                        alert('Payment verification failed.');
                    }
                },
                prefill: {
                    name: orderGroup.bookings[0]?.user_detail?.username || 'Guest',
                    email: orderGroup.bookings[0]?.user_detail?.email || 'guest@example.com',
                },
                theme: {
                    color: "#4A5D6B"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response){
                alert("Payment failed! " + response.error.description);
            });
            rzp1.open();

        } catch (err) {
            console.error(err);
            alert('Failed to initiate payment.');
        } finally {
            setPayLoading(false);
        }
    };

    if (loading) return (
        <div className="container" style={{ padding: '8rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="spinner spinner-primary" style={{ width: '48px', height: '48px', borderWidth: '4px' }}></div>
        </div>
    );
    if (error || !orderGroup) return <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}><p>{error}</p></div>;

    if (orderGroup.status === 'confirmed') {
        return (
            <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
                <h2>This order is already paid and confirmed!</h2>
                <Link to="/my-bookings" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go to My Bookings</Link>
            </div>
        );
    }
    
    // Generate a UPI QR Code dynamically
    const upiString = encodeURIComponent(`upi://pay?pa=admin@upi&pn=NS Mahal&am=${orderGroup.total_price}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${upiString}`;

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                    background: 'var(--color-surface)', 
                    padding: '3rem', 
                    borderRadius: 'var(--radius-lg)', 
                    boxShadow: 'var(--shadow-lg)',
                    width: '100%',
                    maxWidth: '500px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Booking Invoice</h1>
                    <p style={{ color: 'var(--color-text-light)' }}>Review your details and complete payment.</p>
                </div>

                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--color-border)' }}>
                        <span style={{ color: 'var(--color-text-light)' }}>Booked Date</span>
                        <span style={{ fontWeight: 600 }}>
                            {new Date(orderGroup.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric', month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </span>
                    </div>
                    {orderGroup.bookings.map((booking, index) => {
                        const start = new Date(booking.check_in);
                        const end = new Date(booking.check_out);
                        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
                        return (
                            <div key={index} style={{ marginBottom: '1.5rem', borderBottom: index < orderGroup.bookings.length - 1 ? '1px dashed var(--color-border)' : 'none', paddingBottom: index < orderGroup.bookings.length - 1 ? '1rem' : '0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span style={{ color: 'var(--color-text-light)' }}>Room</span>
                                    <span style={{ fontWeight: 600 }}>{booking.room_detail?.number} ({booking.room_detail?.type})</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span style={{ color: 'var(--color-text-light)' }}>Check-in</span>
                                    <span style={{ fontWeight: 500 }}>{booking.check_in}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span style={{ color: 'var(--color-text-light)' }}>Check-out</span>
                                    <span style={{ fontWeight: 500 }}>{booking.check_out}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span style={{ color: 'var(--color-text-light)' }}>Duration</span>
                                    <span style={{ fontWeight: 500 }}>{diffDays} {diffDays === 1 ? 'Night' : 'Nights'}, {diffDays + 1} Days</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--color-text-light)' }}>Guests</span>
                                    <span style={{ fontWeight: 500 }}>{booking.adults} Adults, {booking.children} Children</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Total Amount</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>₹{orderGroup.total_price}</span>
                </div>

                {/* UPI QR Code Section */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontWeight: 600, marginBottom: '1rem' }}>Scan to Pay via UPI</p>
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=nsmahal@ybl&pn=NS%20Mahal&am=${orderGroup.total_price}&cu=INR`)}`} 
                        alt="UPI QR Code" 
                        style={{ border: '4px solid white', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', margin: '0 auto' }} 
                    />
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginTop: '1rem' }}>
                        After payment, please call the admin to confirm your booking.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button 
                        onClick={handlePayNow}  
                        className="btn btn-primary" 
                        disabled={payLoading}
                        style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {payLoading ? (
                            <>
                                <div className="spinner"></div> Processing Payment...
                            </>
                        ) : (
                            <>
                                <QrCode size={20} /> Pay with Razorpay
                            </>
                        )}
                    </button>

                    <a href="tel:+917010276853" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', padding: '1rem', width: '100%' }}>
                        <Phone size={20} />
                        <span>Call Admin for Support</span>
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

export default BillPage;
