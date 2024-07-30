import { useSelector } from 'react-redux';
import { Item } from '../common/catalog/ItemComponent';
import { selectSearchArray } from '../../slices/itemsSlice';

export const SearchTable = () => {
    const searchItems = useSelector(selectSearchArray) || getSearch();

    function getSearch() {
        try {
            return JSON.parse(sessionStorage.getItem('search'));
        } catch (error) {
            return undefined;
        }
    };

    return (
        <section id="catalog-section" className="spaced">

            {searchItems?.length > 0 ?
                <ul className="catalog cards" >
                    {searchItems.map(x => <Item key={x.id} {...x} />)}
                </ul> :
                <div className="item pad-large align-center">
                    <p>Nothing Found!</p>
                </div>
            }

        </section>
    );
};