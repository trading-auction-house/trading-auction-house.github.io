/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { getUser } from '../../../services/utility';

import { cleanAuthError, selectAuthError } from '../../../slices/authSlice';
import { cleanErrorFromCatalog, closeItemOffer, selectItemsError, setErrorToCatalog } from '../../../slices/itemsSlice';


export default function Owner({ item, user }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { title, imgUrl, category, description, price, buyer, id } = item;

    const itemsError = useSelector(selectItemsError);
    const authError = useSelector(selectAuthError);

    const [checkForUser, setCheck] = useState(false);

    useEffect(() => {
        if (authError) {
            dispatch(cleanAuthError());
        }
        if (itemsError) {
            dispatch(cleanErrorFromCatalog());
        }
        // eslint-disable-next-line
    }, []);


    const onSubmit = async () => {
        const result = await dispatch(closeItemOffer(id));
        console.log(result);
        if (result.error) {
            console.log(result.error)
            return;
        }
        navigate('/closed');
    };

    if (checkForUser) {
        navigate('/logout');
    }

    function deleteItem() {
        const hasUser = getUser();

        if (!hasUser) {
            setCheck(true);
            return;
        }

        dispatch(setErrorToCatalog(`Delete/${title}/${id}`));
    }



    return (
        <section id="catalog-section">

            <h1 className="item">
                {title}
                <div className="f-right">
                    <Link to={`/edit/${id}`} className="action pad-small f-left" >Edit</Link>
                    <Link onClick={deleteItem} className="action pad-small f-left" >Delete</Link>
                </div>
            </h1>

            <div className="item padded">

                <div className="layout right large">

                    <div className="col">
                        <img src={imgUrl} className="img-large" alt="" />
                    </div>

                    <div className="content pad-med">

                        <p>In category: <strong>{category}</strong></p>
                        <p>{description}</p>

                        <div className="align-center">
                            <div>
                                Current price: $<strong>{price}</strong>
                            </div>

                            <div>
                                {buyer ?
                                    <div>
                                        Bid by <strong>{buyer.username} </strong>
                                        <Link onClick={onSubmit} className="action pad-med cta">Close Auction</Link>
                                    </div> :
                                    <div>
                                        No bids
                                    </div>}
                            </div>
                        </div>

                    </div>
                </div>

                <footer>
                    <div>Listed by {user.username} </div>
                </footer>
            </div>

        </section>
    );
}