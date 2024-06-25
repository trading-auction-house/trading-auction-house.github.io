import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

import { getUser, validator } from '../services/utility';

import { back4appApi } from '../services/back4Dataservice';

const { cloudLogin,cloudRegister,cloudLogout } = back4appApi();


const userAdapter = createEntityAdapter();

export const loginUser = createAsyncThunk(
    'user/login',
    async (data, { rejectWithValue }) => {

        try {
            validator(data);
            const result = await cloudLogin(data);
            return result;
        } catch (error) {

            return rejectWithValue(error);
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (data, { rejectWithValue }) => {
        try {
            validator(data);
            const result = await cloudRegister(data);
            return result;
        } catch (error) {

            return rejectWithValue(error);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (id) => {
        await cloudLogout();
        return id;
    }
);


const initialState = userAdapter.getInitialState({
    status: 'idle',
    error: null,
    persistedState: getUser()
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        cleanAuthError(state, action) {
            state.error = null;
        },
        setPersistedStateToNull(state, action) {
            state.persistedState = null;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'loginSucceeded';
                state.persistedState = getUser();

                userAdapter.addOne(state, action.payload);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'loginFaild';

                state.error = action.payload;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'registerSucceeded';
                state.persistedState = getUser();

                action.payload.type = 'user';
                userAdapter.addOne(state,action.payload);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'registerFaild';

                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.status = 'logoutSucceeded';
                state.persistedState = null;
                if (action.payload) {
                    userAdapter.removeOne(state, action.payload);
                }
            });

    }
});


export default userSlice.reducer;

export const { cleanAuthError, setUpUser, setPersistedStateToNull } = userSlice.actions;

export const { selectById: selectUserBiId, selectAll: selectAllUsers } = userAdapter.getSelectors(state => state.user);

export const selectUser = state => state.user;

export const selectPersistedState = state => state.user.persistedState;

export const selectAuthError = state => state.user.error;


