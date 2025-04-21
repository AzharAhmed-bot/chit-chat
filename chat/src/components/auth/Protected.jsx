import React ,{useEffect} from 'react'
import UseAuth from './UseAuth'
import Loading from 'pages/common/Loading'
import { useNavigate } from 'react-router-dom'

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
        return <Loading />
    }

    return isAuthenticated ? children : null;
}

export default Protected