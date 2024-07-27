/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FinishedOffers from './FinishedOffersComponent';

import { cleanAuthError, selectAuthError } from '../../../slices/authSlice';
import { cleanErrorFromCatalog, getClosedUserItems, selectClosedOffers, selectItemsError, selectItemsStatus } from '../../../slices/itemsSlice';
import Spinner from '../Spinner';


export default function UserClosedOffers() {
    const dispatch = useDispatch();

    const authError = useSelector(selectAuthError);

    const itemsError = useSelector(selectItemsError);

    const offers = useSelector(selectClosedOffers);

    const status = useSelector(selectItemsStatus);
    
    const fetchUserClosedOffersRequest = status === 'fetchUserClosedOffersStart'

    useEffect(() => {
        dispatch(getClosedUserItems());

        if (authError) {
            dispatch(cleanAuthError());
        }
        if (itemsError) {
            dispatch(cleanErrorFromCatalog());
        }
        // eslint-disable-next-line
    }, []);

    if (!offers || fetchUserClosedOffersRequest) {
        return (
            <Spinner />
        );
    }

    return (
        <section id="catalog-section" className="spaced">

            <h1 className="item">Closed Auctions</h1>

            {offers?.length > 0 ?
                <ul className="catalog cards">
                    {offers.map(x => <FinishedOffers key={x.id} {...x} />)}
                </ul>
                :
                <div className="item pad-large align-center">
                    <p>You haven't closed any auctions yet.</p>
                </div>
            }
        </section>
    );
}