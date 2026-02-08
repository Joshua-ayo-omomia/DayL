import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const api = axios.create({
        baseURL: API_URL,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    api.interceptors.request.use((config) => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
            config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
    });

    const fetchUser = useCallback(async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        return userData;
    };

    const register = async (name, email, password, invitationCode) => {
        const response = await axios.post(`${API_URL}/auth/register`, {
            name,
            email,
            password,
            invitation_code: invitationCode || undefined
        });
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        api,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
        isReviewer: user?.role === 'reviewer' || user?.role === 'admin' || user?.role === 'super_admin',
        refreshUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
