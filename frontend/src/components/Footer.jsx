import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('settings/');
                setSettings(res.data);
            } catch (err) {
                console.error("Failed to fetch settings", err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer style={{
            position: 'relative',
            color: 'var(--color-surface)',
            padding: '4rem 1.5rem',
            textAlign: 'center',
            marginTop: 'auto',
            backgroundImage: 'url("/palani_temple.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            {/* Dark overlay for readability */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)' }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>

                {/* Top Row: NS Mahal and Quote */}
                <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-accent)', fontFamily: 'var(--font-serif)', letterSpacing: '1px', fontWeight: 700 }}>
                        NS Mahal
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', margin: 0, display: 'inline-block', maxWidth: '800px' }}>
                        Where devotion meets comfort, and every stay feels peaceful and blessed.
                    </p>
                </div>

                {/* Bottom Row: 3 Columns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '4rem', textAlign: 'left', marginBottom: '3rem' }}>

                    {/* Column 1: Contact & Address */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div>
                            <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-accent)', fontWeight: 700 }}>Contact Us</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li>
                                    <a href="tel:9842795408,9942437999" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>
                                        <Phone size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                        <span>9842795408, 9942437999</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:info@nsmahal.com" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>
                                        <Mail size={18} style={{ color: 'var(--color-primary)' }} /> info@nsmahal.com
                                    </a>
                                </li>
                                <li style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontWeight: 600 }}>Facebook</a>
                                    <a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontWeight: 600 }}>Instagram</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            {settings && (
                                <a
                                    href={settings.maps_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '0.75rem', color: '#F8FAFC', textDecoration: 'none', fontSize: '1rem', lineHeight: '1.5' }}
                                >
                                    <MapPin size={24} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                    <span style={{ whiteSpace: 'nowrap' }}>{settings.address}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-accent)', fontWeight: 700 }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</Link></li>
                            <li><Link to="/my-bookings" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>My Bookings</Link></li>
                            <li><Link to="/auth" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Login / Register</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div>
                        <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-accent)', fontWeight: 700 }}>Legal</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Terms & Conditions</a></li>
                            <li><a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Privacy Policy</a></li>
                            <li><a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Cancellation & Refund Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', textAlign: 'left' }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0 }}>
                        © {new Date().getFullYear()} NS Mahal. All rights reserved.
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>
                        Designed & Developed securely.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
