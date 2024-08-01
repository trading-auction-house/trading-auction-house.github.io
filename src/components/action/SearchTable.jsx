import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { Item } from '../common/catalog/ItemComponent';
import Spinner from '../common/Spinner';

import { search, selectItemsStatus, selectOldSearchSkip, selectSearchArray, selectSearchData } from '../../slices/itemsSlice';

import { getSearch, getSearchData, getUser, setSearchData } from '../../services/utility';

export const SearchTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const user = getUser();

    const searchItems = useSelector(selectSearchArray) || getSearch();

    const status = useSelector(selectItemsStatus);

    const oldSkip = useSelector(selectOldSearchSkip);

    const oldSearchData = useSelector(selectSearchData) || getSearchData();

    const fetchSearchItems = status === 'searchStarted';
    
    const query = new URLSearchParams(location.search);
    const skip = parseInt(query.get('skip'), 10) || 0;

    const newSearch = {...oldSearchData}

    newSearch.skip = skip;

    if(user){
        newSearch.user = user;
    }

    useEffect(() => {

        if (oldSkip !== skip) {
            dispatch(search(newSearch));
            setSearchData(newSearch);
        }

        // eslint-disable-next-line
    }, [skip]);


    function next() {
        const newSkip = skip + 6;

        navigate(`/search-table?skip=${newSkip}`);
    }

    function previous() {
        const newSkip = Math.max(skip - 6, 0);

        navigate(`/search-table?skip=${newSkip}`);
    }

    if (fetchSearchItems) {
        return (
            <Spinner />
        )
    }

    return (
        <section id="catalog-section" className="spaced">

            {searchItems?.length > 0 ?
                <div>
                    <ul className="catalog cards" >
                        {searchItems.map(x => <Item key={x.id} {...x} />)}
                    </ul>
                    <div>
                        {skip > 0 && <button onClick={previous}>Previous</button>}
                        <button onClick={next}>Next</button>
                    </div>
                </div>
                :
                <div className="item pad-large align-center">
                    <p>Nothing Found!</p>
                </div>
            }

        </section>
    );
};