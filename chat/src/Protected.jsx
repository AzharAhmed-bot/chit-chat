import React ,{useEffect} from 'react'
import UseAuth from './UseAuth'
import { Navigate,useNavigate } from 'react-router-dom'

// protected.jsx
function Protected({ children }) {
    const nav = useNavigate();
    const { isAuthenticated, isLoading } = UseAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            nav('/login');
        }
    }, [isLoading, isAuthenticated, nav]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : null;
}

export default Protected