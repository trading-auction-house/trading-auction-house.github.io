// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import Spinner from '../Spinner';

import Owner from './OwnerComponent';
import NotOwner from './NotOwnerComponent';

import { getItems, selectItemById, selectItems, selectSearchArray, selectUserFromCatalog } from '../../../slices/itemsSlice';

import { getSearch } from '../../../services/utility';

export default function Details() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const searchItems = useSelector(selectSearchArray) || getSearch();

    const item = useSelector(state => selectItemById(state, id)) || searchItems?.filter(item => item.id === id)[0];

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