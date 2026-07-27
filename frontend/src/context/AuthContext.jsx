import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('access');
            if (token) {
                try {
                    const res = await api.get('auth/me/');
                    setUser(res.data);
                } catch (error) {
                    console.error("Token invalid or expired", error);
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = (access, refresh, userData) => {
        localStorage.setItem('access', access);
        if (refresh) localStorage.setItem('refresh', refresh);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('cart');
        setUser(null);
        window.location.href = '/auth';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
