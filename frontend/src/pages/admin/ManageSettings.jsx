import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';

const ManageSettings = () => {
    const [formData, setFormData] = useState({
        address: '',
        maps_url: '',
        phone_number: '',
        terms_conditions: '',
        privacy_policy: '',
        cancellation_policy: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('settings/');
                setFormData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('settings/', formData);
            alert("Settings updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update settings.");
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem 1.5rem' }}><p>Loading settings...</p></div>;

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
                Global Settings
            </motion.h1>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Hotel Address</label>
                        <textarea 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            rows="3" 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Google Maps Link URL</label>
                        <input 
                            type="url" 
                            name="maps_url" 
                            value={formData.maps_url} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Admin Phone Number (for calls)</label>
                        <input 
                            type="text" 
                            name="phone_number" 
                            value={formData.phone_number} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Legal Policies</h3>
                    <div className="input-group">
                        <label>Terms & Conditions</label>
                        <textarea 
                            name="terms_conditions" 
                            value={formData.terms_conditions || ''} 
                            onChange={handleChange} 
                            rows="6" 
                        />
                    </div>
                    <div className="input-group">
                        <label>Privacy Policy</label>
                        <textarea 
                            name="privacy_policy" 
                            value={formData.privacy_policy || ''} 
                            onChange={handleChange} 
                            rows="6" 
                        />
                    </div>
                    <div className="input-group">
                        <label>Cancellation & Refund Policy</label>
                        <textarea 
                            name="cancellation_policy" 
                            value={formData.cancellation_policy || ''} 
                            onChange={handleChange} 
                            rows="6" 
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Save Settings
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ManageSettings;
