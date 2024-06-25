/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { formHandller } from '../../services/utility';

import { setUserToCatalog } from '../../slices/itemsSlice';
import { cleanAuthError, registerUser, selectAuthError } from '../../slices/authSlice';

export default function Register() {
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      dispatch(cleanAuthError());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onRegister = async (data) => {
    const result = await dispatch(registerUser(data));
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

  const onSubmit = formHandller(onRegister);

  return (
    <section id="register-section" className="narrow">

      <h1 className="item">Register</h1>

      <div className="item padded align-center">

        <form className="aligned" onSubmit={onSubmit} >

          <label>
            <span>Email</span>
            <input type="text" name="email" />
          </label>
          <label>
            <span>Username</span>
            <input type="text" name="username" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" name="password" />
          </label>
          <label>
            <span>Repeat Password</span>
            <input type="password" name="repass" />
          </label>

          <div className="align-center">
            <input className="action" type="submit" value="Create Account" />
          </div>

        </form>

      </div>

    </section>
  );
}