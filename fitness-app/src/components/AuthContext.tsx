import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextProps {
    isAuthenticated: boolean;
    token?: string; // Make token optional
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({ isAuthenticated: false, login: () => {}, logout: () => {} });

export const AuthProvider: React.FC<{ children: ReactNode; token?: string }> = ({ children, token }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
