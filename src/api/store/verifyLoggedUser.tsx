import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({child} : {child:any}) => {
    const token = localStorage.getItem('token');

    return token ? child : <Navigate to="/login" />;
};

export default ProtectedRoute;
