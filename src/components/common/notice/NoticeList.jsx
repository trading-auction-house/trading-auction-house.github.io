/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { cleanErrorFromCatalog, selectItemsError, selectUserFromCatalog } from '../../../slices/itemsSlice';
import { cleanAuthError, selectAuthError } from '../../../slices/authSlice';
import { useEffect } from 'react';
import { selectNotices } from '../../../slices/notificationsSlice';

export default function NoticeList() {
    const authError = useSelector(selectAuthError);
    const itemsError = useSelector(selectItemsError);
    const dispatch = useDispatch();

    useEffect(() => {
        if (authError) {
            dispatch(cleanAuthError());
        }
        if (itemsError) {
            dispatch(cleanErrorFromCatalog());
        }
        // eslint-disable-next-line
    }, []);
    /// трябва да се взимат данните за съответните полета от съществуващият store а не да се линосват, със съответните селектори,че иначе се раминават тъпите аидита.
    const notices = useSelector(state => selectNotices(state));
  
    const currentUser = useSelector(state => selectUserFromCatalog(state));
    const userNotices = notices.filter(notice => notice.fromUser._id === currentUser.id);
    console.log(userNotices);
    return (
        <section id="catalog-section">

            <h1>Yours Notifications</h1>

            <div className="noticeList">
                {userNotices?.length > 0 ?
                    <ul className="list">
                        {userNotices.map(notice =>
                            <li key={notice.id} className="partialNotice">
                                <div className="f-right">
                                    <Link to={`/notice/${notice.id}`} className="action pad-small f-left">
                                        See details                                        
                                        {notice.answer ?
                                            <span style={{marginLeft:'12px' }}><i className="fa-regular fa-message"></i></span>
                                            : ''}
                                    </Link>
                                </div>
                                <p className="message">You sent a notice about : {notice.aboutProduct.title}, on : {notice.date}</p>

                            </li>)}
                    </ul> :
                    <div className="item pad-large align-center">
                        <p>You have no notifications!</p>
                    </div>
                }
            </div>

            <div className="item padded">
                <footer>
                    {/* <div>Listed by {currentuser.firstname} </div> */}
                </footer>

            </div>

        </section>
    );
}