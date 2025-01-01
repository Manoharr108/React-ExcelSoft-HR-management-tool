import React, { useContext } from 'react';
import { AuthContext } from '../Contextapi/AuthContext';

const Logout = () => {
    const { setIsAuthenticated } = useContext(AuthContext);

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated'); 
    };

    return <button onClick={handleLogout} className='btn btn-danger'>Logout</button>;
};

export default Logout;
