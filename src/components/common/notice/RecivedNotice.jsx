/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { selectNoticeById } from '../../../slices/notificationsSlice';
import { selectUserFromCatalog } from '../../../slices/itemsSlice';

export default function RecivedNotices() {
    const { id } = useParams();

    const notice = useSelector(state => selectNoticeById(state, id));
    const currentuser = useSelector(state => selectUserFromCatalog(state));


    const currentUserMessege = notice?.fromUser?._id === currentuser.id;

    console.log(currentUserMessege);
    console.log(notice);


    return (
        <section id="catalog-section" className='noticeSection'>

            <h1 className="item noticeHeader">
                {currentUserMessege ?
                    <div className="f-right">
                        <Link className="action pad-small f-left" >Delete message</Link>
                        <Link className="action pad-small f-left" >Edit message</Link>
                    </div> :
                    <div className="f-right">
                        <Link className="action pad-small f-left" >Edit answer</Link>
                    </div>
                }
            </h1>
            <div className='noticeSection'>
                <div className="noticeContainer">
                    <div className="notice">
                        <p className="userName">Message from: <span>{notice?.fromUser?.firstname}{notice?.fromUser?.lastName}</span></p>
                        <p className="userMassege">
                            <span><i className="fa-regular fa-message"></i></span>
                            {notice?.message}</p>
                        {currentUserMessege ? '' :
                            <form className="noticeForm">
                                <label>
                                    <textarea name="description" placeholder="write your answer here..."></textarea>
                                </label>
                                <div className="align-center">
                                    <input type="submit" value="Response" />
                                </div>
                            </form>}
                    </div>
                    <div className='imgContainer'>
                        <img className="noticeImg" src={notice?.aboutProduct?.imgUrl} alt={notice?.aboutProduct?.title} />
                    </div>
                </div>

                <div className="item padded">
                    <footer>
                        <div>Listed by {currentuser.firstname} </div>
                    </footer>

                </div>
            </div>

        </section>
    );
};