/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { getUser } from '../services/utility';

import { selectUserFromCatalog } from '../slices/itemsSlice';

export const AuthGuard = ({
    children,
}) => {
    const user = getUser();
    const userFromCatalog = useSelector(state => selectUserFromCatalog(state));
    
    if (!user || !userFromCatalog) {
        return <Navigate to='/login' />;
    }

    return children ? children : <Outlet />;

};