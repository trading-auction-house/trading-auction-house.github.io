import { Item } from '../common/catalog/ItemComponent';

export const SearchTable = ({ searchItems }) => {
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