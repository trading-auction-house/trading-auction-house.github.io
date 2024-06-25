import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

import { makeCorrectIdForRedux } from '../services/utility';

import { api } from '../services/dataService';

const noticeAdapter = createEntityAdapter();

const { createNotification, getAllNotices, } = api();

const initialState = noticeAdapter.getInitialState({
    status: 'idle',
    error: null,
});

export const getNotifications = createAsyncThunk(
    'notice/fetchNotice',
    async (_, { rejectWithValue }) => {
        try {
            const result = await getAllNotices();
            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


export const setNotification = createAsyncThunk(
    'notice/createNotice',
    async (data, { rejectWithValue }) => {
        try {
            const result = await createNotification(data);
            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);



const noticesSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.status = 'fetchNoticesSucceeded';
                noticeAdapter.addMany(state, action.payload.map(notice => {
                    notice.type = 'notice';
                    return makeCorrectIdForRedux(notice);
                }));
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.status = 'fetchNoticesFaild';

                state.error = action.payload;
            })
            .addCase(setNotification.fulfilled, (state, action) => {
                state.status = 'createNoticeSucceeded';
                action.payload.type = 'notice';
                noticeAdapter.addOne(state, makeCorrectIdForRedux(action.payload));
            })
            .addCase(setNotification.rejected, (state, action) => {
                state.status = 'createNoticeFail';

                state.error = action.payload;
            });
    }
});

export default noticesSlice.reducer;

export const { selectAll: selectNotices, selectById: selectNoticeById } = noticeAdapter.getSelectors(state => state.notifications);
