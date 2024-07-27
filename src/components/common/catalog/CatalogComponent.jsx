// /* eslint-disable @typescript-eslint/no-restricted-imports */
// import { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

// import { Item } from './ItemComponent';

// import { cleanAuthError, selectAuthError } from '../../../slices/authSlice';
// import { cleanErrorFromCatalog, getItems, selectItems, selectItemsError, selectItemsStatus } from '../../../slices/itemsSlice';

// import Spinner from '../Spinner';

// export default function Catalog() {
//     const dispatch = useDispatch();

//     const authError = useSelector(selectAuthError);

//     const itemsError = useSelector(selectItemsError);

//     const items = useSelector(state => selectItems(state));

//     const status = useSelector(selectItemsStatus);

//     const fetchItemsRequest = status === 'fetchItemStarted';

//     let skip = 0;

//     useEffect(() => {
//         if (authError) {
//             dispatch(cleanAuthError());
//         }

//         if (itemsError) {
//             dispatch(cleanErrorFromCatalog());
//         }

//         if(items.length === 0){
//             dispatch(getItems());
//         }
//         // eslint-disable-next-line
//     }, []);

//     function next(){
//         skip += 6
//         dispatch(getItems({skip}));
//     }


//     return (
//         <div>
//             {!fetchItemsRequest &&
//             <section id="catalog-section" className="spaced">

//                 {items?.length > 0 ?
//                     <ul className="catalog cards">
//                         {items.map(x => <Item key={x.id} {...x} />)}
//                     </ul> :
//                     <div className="item pad-large align-center">
//                         <p>Nothing has been listed yet. Be the first!</p>
//                         <div>
//                             <Link className="action" to="/create">Publish Auction</Link>
//                         </div>
//                     </div>
//                 }
//                 <span>{'>>>'}<Link onClick={next} to={`/catalog/${skip}`}>Next</Link></span>

//             </section>}
//             {fetchItemsRequest && <Spinner />}
//         </div>
//     );
// }


/* eslint-disable @typescript-eslint/no-restricted-imports */
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Item } from './ItemComponent';

import { cleanAuthError, selectAuthError } from '../../../slices/authSlice';
import { cleanErrorFromCatalog, getItems, selectItems, selectItemsError, selectItemsStatus } from '../../../slices/itemsSlice';

import Spinner from '../Spinner';

export default function Catalog() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const authError = useSelector(selectAuthError);
    const itemsError = useSelector(selectItemsError);
    const items = useSelector(selectItems);
    const status = useSelector(selectItemsStatus);
    const fetchItemsRequest = status === 'fetchItemStarted';

    // Get the 'skip' parameter from the URL
    const query = new URLSearchParams(location.search);
    let skip = parseInt(query.get('skip'), 10) || 0;

    useEffect(() => {
        if (authError) {
            dispatch(cleanAuthError());
        }

        if (itemsError) {
            dispatch(cleanErrorFromCatalog());
        }

        dispatch(getItems({ skip }));

        // eslint-disable-next-line
    }, [skip]);

    function next() {
        console.log('next')
        const newSkip = skip + 6;
        console.log(newSkip)
        navigate(`/catalog?skip=${newSkip}`);
    }

    function previous() {
        const newSkip = Math.max(skip - 6, 0);
        navigate(`/catalog?skip=${newSkip}`);
    }

    return (
        <div>
            {!fetchItemsRequest &&
                <section id="catalog-section" className="spaced">
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
                    <div>
                        {skip > 0 && <button onClick={previous}>Previous</button>}
                        <button onClick={next}>Next</button>
                    </div>
                </section>}
            {fetchItemsRequest && <Spinner />}
        </div>
    );
}
