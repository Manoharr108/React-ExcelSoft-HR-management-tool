import React, { useContext } from 'react';
import AdminButton from './components/AdminButton';
import Network from './components/Network';
import Login from './components/Login';
import { useAuth } from './context/Authcontext';


function App() {
    const { user } = useAuth();
    return (
        <>{!user?<Login></Login>:
            <Network /> && <AdminButton />}
        </>
    );
}

export default App;
