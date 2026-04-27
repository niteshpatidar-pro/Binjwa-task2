import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // In a real app, verify token or fetch user profile
            // For now, we trust the token existence and rely on refresh token if expired
            // Let's mock fetching the user from local storage for persistence
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { accessToken, user: userData } = res.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
