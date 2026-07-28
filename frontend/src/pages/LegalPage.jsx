import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

const LegalPage = () => {
    const { type } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    const titleMap = {
        'terms': 'Terms & Conditions',
        'privacy': 'Privacy Policy',
        'cancellation': 'Cancellation & Refund Policy'
    };
    
    const keyMap = {
        'terms': 'terms_conditions',
        'privacy': 'privacy_policy',
        'cancellation': 'cancellation_policy'
    };

    const title = titleMap[type] || 'Legal Information';
    const fieldKey = keyMap[type];

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('settings/');
                if (fieldKey && res.data[fieldKey]) {
                    setContent(res.data[fieldKey]);
                } else {
                    setContent('This policy has not been updated yet.');
                }
            } catch (err) {
                console.error("Failed to fetch settings", err);
                setContent('Error loading policy. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [type, fieldKey]);

    return (
        <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
            <motion.h1 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}
            >
                {title}
            </motion.h1>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                style={{ 
                    background: 'var(--color-surface)', 
                    padding: '2.5rem', 
                    borderRadius: 'var(--radius-md)', 
                    boxShadow: 'var(--shadow-sm)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.8'
                }}
            >
                {loading ? 'Loading...' : content}
            </motion.div>
        </div>
    );
};

export default LegalPage;
