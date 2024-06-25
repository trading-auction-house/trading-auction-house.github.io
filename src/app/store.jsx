import {  configureStore } from '@reduxjs/toolkit';

import userReducer from '../slices/authSlice';
import itemsReducer from '../slices/itemsSlice';

export const store = configureStore({
  reducer:{
    user : userReducer,
    items: itemsReducer,
  }
});
