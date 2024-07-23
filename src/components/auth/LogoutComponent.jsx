// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { logoutUser, selectAuthStatus, selectUser } from '../../slices/authSlice';
import { clearUserFromCatalog, clearClosedOffers } from '../../slices/itemsSlice';

import Spinner from '../common/Spinner';

export default function Logout() {
    const status = useSelector(selectAuthStatus);
    const user = Object.entries(useSelector(selectUser).entities);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        async function wait() {
            await logout();
            navigate('/');
        }

        async function logout() {
            if (user[0]) {
                await dispatch(logoutUser(user[0][0]));
            } else {
                dispatch(logoutUser());
            }
            dispatch(clearUserFromCatalog());
            dispatch(clearClosedOffers());
        }

        wait();
        // eslint-disable-next-line
    }, []);

    if (status === 'logoutStarted') {
        return <Spinner />;
    }
}