import React, { useState, useContext } from 'react';
import { AuthContext } from "../Contextapi/AuthContext" 

const Login = () => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const adminPassword = 'admin123'; 

        if (password === adminPassword) {
            setIsAuthenticated(true);
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
