// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { logoutUser, selectUser } from '../../slices/authSlice';
import { clearUserFromCatalog } from '../../slices/itemsSlice';


export default function Logout() {
    const user = Object.entries(useSelector(selectUser).entities);
    
    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            if(user[0]){
                await dispatch(logoutUser(user[0][0]));
            }else{
                dispatch(logoutUser());
            }
            dispatch(clearUserFromCatalog());
        }
        
        fetchData();
        navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}