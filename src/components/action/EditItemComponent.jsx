/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Spinner from '../common/Spinner';

import { formHandller } from '../../services/utility';

import { editItem, selectItemById, selectItemsStatus } from '../../slices/itemsSlice';

export default function Edit() {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { id } = useParams();

    const item = useSelector(state => selectItemById(state, id));

    const status = useSelector(selectItemsStatus);

    const editRequest = status === 'editItemStarted';

    const editCurrentItem = async (data) => {
        let result;

        const { title, category, imgUrl, price, description } = data;

        const withoutImage = { title, category, price, description };

        if (!data.price) {
            data.price = item.price;
        }

        data.price = Number(data.price);
        withoutImage.price = data.price;

        if (imgUrl.name !== '') {
            result = await dispatch(editItem({ data, id }));
        } else {
            data = withoutImage;
            result = await dispatch(editItem({ data, id }));
        }

        if (result.error) {
            return;
        } else {
            navigate(`/details/${id}`);
        }
    };

    const onSubmit = formHandller(editCurrentItem);


    if (item) {

        return (
            <div>
                {!editRequest &&<section id="create-section">

                    <h1 className="item">Edit Auction</h1>

                    <div className="item padded align-center">

                        <form className="layout left large" onSubmit={onSubmit} >

                            <div className="col aligned">
                                <label>
                                    <span>Title</span>
                                    <input type="text" name="title" defaultValue={item.title} />
                                </label>

                                <label>
                                    <span>Category</span>
                                    <select name="category" defaultValue={item.category}  >
                                        <option value="estate">Real Estate</option>
                                        <option value="vehicles">Vehicles</option>
                                        <option value="furniture">Furniture</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="other">Other</option>
                                    </select>
                                </label>

                                <div className='devicePicture'>
                                    <span>
                                        Change Image
                                    </span>
                                    <label>
                                        Chose your file
                                        <input type="file" name="imgUrl" />
                                    </label>
                                </div>

                                <label>
                                    <span>Starting price</span>
                                    <input type="number" name="price"
                                        disabled={(item.buyer) ? 'disabled' : ''}
                                        defaultValue={item.price}
                                    />
                                </label>
                            </div>

                            <div className="content pad-med align-center vertical">
                                <label>
                                    <span>Description</span>
                                    <textarea name="description" defaultValue={item.description} ></textarea>
                                </label>

                                <div className="align-center">
                                    <input className="action" type="submit" value="Update Listing" />
                                </div>
                            </div>

                        </form>

                    </div>

                </section>}
                {editRequest && <Spinner />}
            </div>
        );
    }

    return (
        <Spinner />
    );
}