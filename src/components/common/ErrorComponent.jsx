/* eslint-disable @typescript-eslint/no-restricted-imports */
/* eslint-disable no-inner-declarations */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearUser} from '../../services/utility';

import {  setPersistedStateToNull } from '../../slices/authSlice';
import { cleanErrorFromCatalog, deleteItem, getItems, setErrorToCatalog } from '../../slices/itemsSlice';



export default function Error({ error }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // In case someone manipulates localStorage to make a request with a fake token.
        if ( error === 'Invalid session token'|| error === 'Object not found.') {
            clearUser();
            dispatch(setPersistedStateToNull());
            dispatch(getItems());
            navigate('/catalog');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function cancelDelete() {
        dispatch(cleanErrorFromCatalog());
    }

    if (Array.isArray(error)) {
        return (
            <div className="error-box">
                <p>{error.join('\n')}</p>
            </div>
        );
    } else if (typeof error === 'string' && error.includes('Delete')) {
        const title = error.split('/');
        const id = title[title.length - 1];

        async function deleteCurrentItem() {
            try {
                await dispatch(deleteItem(id));
                navigate('/catalog');
            } catch (error) {
                dispatch(setErrorToCatalog(error));
            }
        }

        return (
            <div className="error-box">
                <p id='delete'><span >Are you sure you want to delete {title[1]} </span>
                    <button onClick={deleteCurrentItem} className="error-box">Confirm</button>
                    <button onClick={cancelDelete} className="error-box">Cancel</button>
                </p>
            </div>
        );

    } else if (typeof error === 'string' && error !== '') {
        return (
            <div className="error-box">
                <p>{error}</p>
            </div>
        );
    } else if (typeof error === 'object' && error !== null) {
        return (
            <div className="error-box">
                <p>There seems to be a problem please try again later</p>
            </div>
        );
    }
}