/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { formHandller } from '../../services/utility';

import { setUserToCatalog } from '../../slices/itemsSlice';
import { cleanAuthError, loginUser, selectAuthError} from '../../slices/authSlice';

export default function Login() {
    const error = useSelector(selectAuthError);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(error){
            dispatch(cleanAuthError());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const userLogin = async (data) => {
        const result = await dispatch(loginUser(data));
        if (result.error) {
            return;
        } else {
            if (error) {
                dispatch(cleanAuthError());
            }
            dispatch(setUserToCatalog(result.payload));
            navigate('/');
        }
    };

    const onSubmut = formHandller(userLogin);

    return (
        <section id="login-section" className="narrow">

            <h1 className="item">Login</h1>

            <div className="item padded align-center">

                <form className="aligned" onSubmit={onSubmut} >

                    <label>
                        <span>Username</span>
                        <input type="text" name="username" />
                    </label>
                    <label>
                        <span>Password</span>
                        <input type="password" name="password" />
                    </label>

                    <div className="align-center">
                        <input className="action" type="submit" value="Sign In" />
                    </div>

                </form>

            </div>

        </section>


    );
}