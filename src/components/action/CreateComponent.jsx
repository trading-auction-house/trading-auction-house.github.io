/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { formHandller } from '../../services/utility';

import { cleanAuthError, selectAuthError } from '../../slices/authSlice';
import { cleanErrorFromCatalog, createItem, selectItemsError } from '../../slices/itemsSlice';



export default function CreateItem() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const authError = useSelector(selectAuthError);
    const itemsError = useSelector(selectItemsError);


    useEffect(() => {
        if (authError) {
            dispatch(cleanAuthError());
        }
        if (itemsError) {
            dispatch(cleanErrorFromCatalog());
        }
        // eslint-disable-next-line
    }, []);

    const create = async (data) => {
        data.price = Number(data.price);
        const result = await dispatch(createItem(data));

        if (result.error) {
            return;
        }
        
        navigate('/catalog');
    };

    const onSubmit = formHandller(create);

    return (
        <section id="create-section" className="">

            <h1 className="item">New Auction</h1>

            <div className="item padded align-center">

                <form className="layout left large" onSubmit={onSubmit}>

                    <div className="col aligned">
                        <label>
                            <span>Title</span>
                            <input type="text" name="title" /></label>
                        <label>
                            <span>Category</span>
                            <select name="category" defaultValue={'estate'} >
                                <option value="estate">Real Estate</option>
                                <option value="vehicles">Vehicles</option>
                                <option value="furniture">Furniture</option>
                                <option value="electronics">Electronics</option>
                                <option value="other">Other</option>
                            </select>
                        </label>
                        <label>
                            <span>Image URL</span>
                            <input type="text" name="imgUrl" /></label>
                        <label>
                            <span>Starting price</span>
                            <input type="number" name="price" /></label>
                    </div>

                    <div className="content pad-med align-center vertical">
                        <label>
                            <span>Description</span>
                            <textarea name="description" ></textarea>
                        </label>

                        <div className="align-center">
                            <input className="action" type="submit" value="Publish Item" />
                        </div>
                    </div>

                </form>

            </div>

        </section>
    );
}