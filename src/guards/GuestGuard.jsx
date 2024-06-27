import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { getUser } from '../services/utility';

import { selectUserFromCatalog } from '../slices/itemsSlice';

export const GuestGuard = ({
    children,
}) => {
    const user = getUser();
    const userFromCatalog = useSelector(state => selectUserFromCatalog(state));

    if (user || userFromCatalog) {
        return <Navigate to='/catalog' />;
    }

    return children ? children : <Outlet />;

};