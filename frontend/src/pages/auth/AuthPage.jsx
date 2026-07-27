import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Phone, KeyRound, UserPlus, LogIn, Send, Mail } from 'lucide-react';
import api from '../../services/api';

const AuthPage = () => {
    // Modes: 'login' | 'register' | 'forgot_request' | 'forgot_verify'
    const [authMode, setAuthMode] = useState('login');
    
    // Form fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const redirectParams = new URLSearchParams(location.search);
    const redirectUrl = redirectParams.get('redirect') || '/';

    const handleLoginRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        
        if (authMode === 'register' && !username.trim()) {
            setError('Please enter your name');
            return;
        }
        if (authMode === 'register' && (!email || !email.includes('@'))) {
            setError('Please enter a valid email address');
            return;
        }
        if (authMode === 'register' && phone.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }
        if (authMode === 'login' && phone.length < 4) {
            setError('Please enter a valid phone number or username');
            return;
        }
        if (!password.trim()) {
            setError('Please enter a password');
            return;
        }

        setLoading(true);
        
        try {
            if (authMode === 'login') {
                const res = await api.post('auth/login/', { username: phone, password });
                login(res.data.access, res.data.refresh, res.data.user);
                
                if (res.data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate(redirectUrl);
                }
            } else if (authMode === 'register') {
                const payload = { username: phone, password, phone: phone, first_name: username, email: email.trim() };
                
                const res = await api.post('auth/register/', payload);
                const loginRes = await api.post('auth/login/', { username: phone, password });
                login(loginRes.data.access, loginRes.data.refresh, loginRes.data.user);
                navigate(redirectUrl);
            }
        } catch (err) {
            console.error(err);
            if (authMode === 'register') {
                const data = err.response?.data;
                if (data?.username) {
                    setError('This phone number is already registered.');
                } else if (data?.phone) {
                    setError('This phone number is already registered.');
                } else if (data?.error) {
                    setError(data.error);
                } else {
                    setError('Registration failed. Please try again.');
                }
            } else {
                setError(err.response?.data?.error || 'Invalid credentials');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotRequest = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        
        if (!email || !email.includes('@')) {
            setError('Please enter your registered email address');
            return;
        }
        
        setLoading(true);
        try {
            const res = await api.post('auth/forgot-password-otp/', { email: email.trim() });
            setSuccessMsg(res.data?.message || 'OTP code sent! Please check your email.');
            setAuthMode('forgot_verify');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP. Account might not exist.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotVerify = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        
        if (!otp || otp.length < 6) {
            setError('Please enter the valid OTP');
            return;
        }
        if (!newPassword) {
            setError('Please enter a new password');
            return;
        }
        
        setLoading(true);
        try {
            await api.post('auth/reset-password/', { email: email.trim(), otp, new_password: newPassword });
            setSuccessMsg('Password successfully reset! Please log in with your new password.');
            setAuthMode('login');
            // Clear forgot password fields
            setEmail('');
            setOtp('');
            setNewPassword('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. OTP might be invalid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{ background: 'var(--color-surface)', padding: '3rem', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    {(authMode === 'login' || authMode === 'register') && (
                        <div style={{ display: 'inline-flex', background: 'var(--color-background)', padding: '0.5rem', borderRadius: '12px', marginBottom: '1.5rem', gap: '0.5rem' }}>
                            <button 
                                type="button"
                                onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
                                style={{ 
                                    padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                                    background: authMode === 'login' ? 'var(--color-primary)' : 'transparent',
                                    color: authMode === 'login' ? '#fff' : 'var(--color-text-light)'
                                }}
                            >
                                Log In
                            </button>
                            <button 
                                type="button"
                                onClick={() => { setAuthMode('register'); setError(''); setSuccessMsg(''); }}
                                style={{ 
                                    padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                                    background: authMode === 'register' ? 'var(--color-primary)' : 'transparent',
                                    color: authMode === 'register' ? '#fff' : 'var(--color-text-light)'
                                }}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                    
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--color-text)' }}>
                        {authMode === 'login' && 'Welcome Back'}
                        {authMode === 'register' && 'Create an Account'}
                        {authMode === 'forgot_request' && 'Forgot Password'}
                        {authMode === 'forgot_verify' && 'Reset Password'}
                    </h2>
                    
                    {authMode === 'forgot_request' && (
                        <p style={{ color: 'var(--color-text-light)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                            Enter the phone number associated with your account to receive a reset code.
                        </p>
                    )}
                    {authMode === 'forgot_verify' && (
                        <p style={{ color: 'var(--color-text-light)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                            Enter the code sent to your phone and your new password.
                        </p>
                    )}
                </div>
                
                {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{error}</div>}
                {successMsg && <div style={{ background: '#DCFCE7', color: '#15803D', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{successMsg}</div>}

                {(authMode === 'login' || authMode === 'register') && (
                    <form onSubmit={handleLoginRegister}>
                        {authMode === 'register' && (
                            <>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-light)' }}>Your Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                        <input 
                                            type="text"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            placeholder="Enter your name"
                                            required
                                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '1rem', background: 'var(--color-background)' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-light)' }}>Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                        <input 
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="user@gmail.com (for password reset)"
                                            required
                                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '1rem', background: 'var(--color-background)' }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-light)' }}>
                                Phone Number
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                <input 
                                    type="text"
                                    value={phone}
                                    onChange={e => {
                                        if (authMode === 'register') {
                                            setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                                        } else {
                                            setPhone(e.target.value);
                                        }
                                    }}
                                    placeholder="10-digit phone number"
                                    required
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '1rem', background: 'var(--color-background)' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '0.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-light)' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '1rem', background: 'var(--color-background)' }}
                                />
                            </div>
                        </div>
                        
                        {authMode === 'login' ? (
                            <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
                                <button type="button" onClick={() => { setAuthMode('forgot_request'); setError(''); setSuccessMsg(''); }} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', padding: '0.5rem 0' }}>
                                    Forgot Password?
                                </button>
                            </div>
                        ) : (
                            <div style={{ marginBottom: '2rem' }}></div>
                        )}

                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={loading} 
                            style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
                        >
                            {loading ? 'Processing...' : (authMode === 'login' ? <><LogIn size={20} /> Log In</> : <><UserPlus size={20} /> Create Account</>)}
                        </button>
                    </form>
                )}

                {authMode === 'forgot_request' && (
                    <form onSubmit={handleForgotRequest}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-light)' }}>Registered Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Enter your registered email address"
                                    required
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '1rem', background: 'var(--color-background)' }}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={loading} 
                            style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '1rem' }}
                        >
                            {loading ? 'Sending...' : <><Send size={20} /> Send OTP Code</>}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
                            className="btn btn-outline" 
                            style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem' }}
                        >
                            Back to Login
                        </button>
                    </form>
                )}

                {authMode === 'forgot_verify' && (
                    <form onSubmit={handleForgotVerify}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-light)' }}>Registered Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                <input 
                                    type="email"
                                    value={email}
                                    disabled
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '1rem', background: 'var(--color-surface)', color: 'var(--color-text-light)' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-light)' }}>OTP Code</label>
                            <div style={{ position: 'relative' }}>
                                <KeyRound size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                <input 
                                    type="text"
                                    maxLength="6"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Enter 6-digit code"
                                    required
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '1rem', background: 'var(--color-background)', letterSpacing: '2px' }}
                                />
                            </div>
                        </div>
                        
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-light)' }}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                <input 
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '1rem', background: 'var(--color-background)' }}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={loading || otp.length < 6 || !newPassword} 
                            style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '1rem' }}
                        >
                            {loading ? 'Resetting...' : <><Lock size={20} /> Reset Password</>}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
                            className="btn btn-outline" 
                            style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem' }}
                        >
                            Back to Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthPage;

