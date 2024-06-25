/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SearchTable } from './SearchTable';

import { formHandller } from '../../services/utility';

import { cleanAuthError, selectAuthError } from '../../slices/authSlice';
import { cleanErrorFromCatalog, selectItems, selectItemsError } from '../../slices/itemsSlice';

export default function Search() {
    const dispatch = useDispatch();
    
    const items = useSelector(selectItems);
    const authError = useSelector(selectAuthError);
    const itemsError = useSelector(selectItemsError);

    const [searchItems, setSearchItems] = useState(() => {
        const searchItemsState = sessionStorage.getItem('search');

        if (searchItemsState) {
            const hasSearchItems = JSON.parse(searchItemsState);

            return hasSearchItems;
        }
        return null;
    });

    useEffect(() => {
        if (authError) {
            dispatch(cleanAuthError());
        }
        if (itemsError) {
            dispatch(cleanErrorFromCatalog());
        }

        const select = document.getElementById('select');
        select.value = '';

        return () => {
            sessionStorage.clear();
        };
        // eslint-disable-next-line
    }, []);



    const search = (data, event) => {
        let selectItems;

        let point;
        
        const searchTarget = Object.fromEntries(Object.entries(data).filter(x => x[1] !== ''));

        for (const field in searchTarget) {
            if (!point) {
                if (field === 'lower') {
                    selectItems = items.filter(x => x.price >= Number(searchTarget[field]));
                    point = true;
                } else if (field === 'upper') {
                    selectItems = items.filter(x => x.price <= Number(searchTarget[field]));
                    point = true;
                } else {
                    selectItems = items.filter(x => x.category === searchTarget[field]);
                    point = true;
                }
            } else if (point) {
                if (field === 'lower') {
                    selectItems = selectItems.filter(x => x.price >= searchTarget[field]);
                } else if (field === 'upper') {
                    selectItems = selectItems.filter(x => x.price <= searchTarget[field]);
                }
            }
        }
        
        setSearchItems(selectItems);

        selectItems ? sessionStorage.setItem('search', JSON.stringify(selectItems)) : sessionStorage.clear();

        Array.from(event.target).forEach((e) => (e.value = ''));
    };


    const onSubmit = formHandller(search);

    return (
        <>
            <section id="login-section" className="spaced">

                <h1 className="item narrow">Search</h1>
                <div className="item padded align-center narrow">

                    <form className="aligned" onSubmit={onSubmit}>
                        <label>
                            <span>Choose Category</span>
                            <select name="category" id='select'>
                                <option value="estate">Real Estate</option>
                                <option value="vehicles">Vehicles</option>
                                <option value="furniture">Furniture</option>
                                <option value="electronics">Electronics</option>
                                <option value="other">Other</option>
                            </select>
                        </label>

                        <label>
                            <span>Set a Price Floor</span>
                            <input id="lower-range" type="number" name="lower" />
                        </label>

                        <label>
                            <span>Set a Price Limit</span>
                            <input id="rangeValue" type="number" name="upper" />
                        </label>

                        <div className="align-center">
                            <button className="action">Select</button>
                        </div>


                    </form>

                </div>

            </section>

            {searchItems && <SearchTable searchItems={searchItems} />}
        </>
    );

}
