/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Item } from './ItemComponent';

import { cleanAuthError, selectAuthError } from '../../../slices/authSlice';
import { cleanErrorFromCatalog, getItems, selectItems, selectItemsError, selectItemsStatus } from '../../../slices/itemsSlice';

import Spinner from '../Spinner';

export default function Catalog() {
    const dispatch = useDispatch();

    const authError = useSelector(selectAuthError);

    const itemsError = useSelector(selectItemsError);

    const items = useSelector(state => selectItems(state));

    const status = useSelector(selectItemsStatus);

    const fetchItemsRequest = status === 'fetchItemStarted'

    useEffect(() => {
        if (authError) {
            dispatch(cleanAuthError());
        }
        if (itemsError) {
            dispatch(cleanErrorFromCatalog());
        }
        dispatch(getItems())
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            {!fetchItemsRequest &&<section id="catalog-section" className="spaced">

                {items?.length > 0 ?
                    <ul className="catalog cards">
                        {items.map(x => <Item key={x.id} {...x} />)}
                    </ul> :
                    <div className="item pad-large align-center">
                        <p>Nothing has been listed yet. Be the first!</p>
                        <div>
                            <Link className="action" to="/create">Publish Auction</Link>
                        </div>
                    </div>
                }

            </section>}
            {fetchItemsRequest && <Spinner />}
        </div>
    );
}