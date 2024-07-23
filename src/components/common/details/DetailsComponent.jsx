// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Spinner from '../Spinner';

import Owner from './OwnerComponent';
import NotOwner from './NotOwnerComponent';

import { getItems, selectItemById, selectItems, selectUserFromCatalog } from '../../../slices/itemsSlice';
import { useEffect } from 'react';

export default function Details() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const item = useSelector(state => selectItemById(state, id));

    const user = useSelector(state => selectUserFromCatalog(state));

    const items = useSelector(state => selectItems(state));

    useEffect(() => {        
        if(items.length === 0){
            dispatch(getItems());
        }
        // eslint-disable-next-line
    }, []);


    if (item) {
        const isOwner = item.owner === user?.id;
        if (isOwner) {
            return (
                <Owner item={item} user={user} />
            );
        }
        return (
            <NotOwner item={item} user={user}/>
        );
    }

    return (
        <Spinner />
    );
}