import {  configureStore } from '@reduxjs/toolkit';

import userReducer from '../slices/authSlice';
import itemsReducer from '../slices/itemsSlice';
import noticesReducer from '../slices/notificationsSlice';


export const store = configureStore({
  reducer:{
    user : userReducer,
    items: itemsReducer,
    notifications : noticesReducer
  }
});
