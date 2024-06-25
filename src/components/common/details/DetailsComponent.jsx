// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Spinner from '../Spinner';

import Owner from './OwnerComponent';
import NotOwner from './NotOwnerComponent';

import { selectItemById, selectUserFromCatalog } from '../../../slices/itemsSlice';

export default function Details() {
    const { id } = useParams();
    
    const item = useSelector(state => selectItemById(state, id));
    const user = useSelector(state => selectUserFromCatalog(state));

    if (item) {
        const isOwner = true //item.owner === user?.id;
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