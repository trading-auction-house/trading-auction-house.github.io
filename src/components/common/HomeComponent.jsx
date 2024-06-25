/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import { cleanErrorFromCatalog, selectItemsError } from '../../slices/itemsSlice';

export default function Home() {
    const dispatch = useDispatch();
    const itemsError = useSelector(selectItemsError);


    useEffect(() => {
        if (itemsError) {
            dispatch(cleanErrorFromCatalog());
        }
        // eslint-disable-next-line
    }, []);

    return (
        <section id="catalog-section">

            <h1 className="item">Home</h1>

            <div className="item">

                <div className="layout left med">
                    <div className="col">
                        <img src="/static/assets/splash.jpg" className="img-med" alt="static" />
                    </div>

                    <div className="content pad-med">
                        <p>Welcome to the online Auction House.</p>
                        <p>Buy and sell items in categories Real Estate, Vehicles, Furniture, Electronics and
                            Others. Browse available items and place your bid. Create a new listing and collect the
                            highest offer.
                        </p>

                        <div className="align-center">
                            <Link className="action" to="/catalog">Browse Listings</Link>
                            <Link className="action" to="/create">Publish Auction</Link>
                            <Link className="action" to="/notice">Notifications</Link>

                        </div>
                    </div>
                </div>

            </div>

        </section>
    );
}