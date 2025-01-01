import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => JSON.parse(localStorage.getItem('isAuthenticated')) || false
    );

    useEffect(() => {
        localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
