import React, { useContext } from 'react';
import AdminButton from './components/AdminButton';
import Network from './components/Network';
import { AuthContext } from './Contextapi/AuthContext'; 
import Login from './components/Login';

function App() {
    const { isAuthenticated } = useContext(AuthContext); 

    return (
        <>
            <Network />
            {isAuthenticated ? <AdminButton /> : <Login />}
        </>
    );
}

export default App;
