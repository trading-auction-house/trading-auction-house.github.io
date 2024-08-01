/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { formHandller, getUser, setSearch, setSearchData } from '../../services/utility';

import { cleanAuthError, selectAuthError } from '../../slices/authSlice';
import { cleanErrorFromCatalog, search, selectItemsError, selectItemsStatus } from '../../slices/itemsSlice';
import Spinner from '../common/Spinner';

export default function Search() {
    const dispatch = useDispatch();

    const navigate = useNavigate()

    const authError = useSelector(selectAuthError);
    const itemsError = useSelector(selectItemsError);
    const status = useSelector(selectItemsStatus);

    const user = getUser();

    const fetchSearchItems = status === 'searchStarted';

    const query = new URLSearchParams(location.search);
    let skip = parseInt(query.get('skip'), 10) || 0;

    useEffect(() => {
        if (authError) {
            dispatch(cleanAuthError());
        }
        if (itemsError) {
            dispatch(cleanErrorFromCatalog());
        }

        const select = document.getElementById('select');
        select.value = '';

        // return () => {
        //     sessionStorage.clear();
        // };
        // eslint-disable-next-line
    }, []);




    const searchItems = async (data, event) => {
        const searchTarget = Object.fromEntries(Object.entries(data).filter(x => x[1] !== ''));

        searchTarget.skip = skip;

        if(user){
        searchTarget.user = user;
        }

        const selectItems = await dispatch(search(searchTarget));

        if (selectItems.error) {
            return;
        } else {
            if (itemsError) {
                dispatch(cleanErrorFromCatalog());
                dispatch(cleanAuthError());
            }
        }
        
        selectItems ? setSearch(selectItems.payload.result.items) : sessionStorage.clear();

        setSearchData(searchTarget);

        Array.from(event.target).forEach((e) => (e.value = ''));

        navigate('/search-table')
    };


    const onSubmit = formHandller(searchItems);

    if (fetchSearchItems) {
        return (
            <Spinner />
        )
    }

    return (
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
    );

}
