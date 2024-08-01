import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

import { validator, getUser } from '../services/utility';

import { back4appApi } from '../services/back4Dataservice';

const itemsAdapter = createEntityAdapter();

const { getCloudItems, saveItem, updateItem, addItemBuyer, closeOffer, getUserClosedOffers, deleteItemFDB, searchItems } = back4appApi();

export const getItems = createAsyncThunk(
    'items/fetchItems',
    async (data, { rejectWithValue }) => {
        try {
            const result = await getCloudItems(data);
            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


export const createItem = createAsyncThunk(
    'items/createItem',
    async (data, { rejectWithValue }) => {
        try {
            validator(data);
            const result = await saveItem(data);
            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const editItem = createAsyncThunk(
    'items/editItem',
    async ({ data, id }, { rejectWithValue }) => {
        try {
            validator(data);

            const result = await updateItem(data, id);

            return result;
        } catch (error) {
            return rejectWithValue(error);
        }

    }
);

export const deleteItem = createAsyncThunk(
    'items/deleteItem',

    async (id, { rejectWithValue }) => {
        try {
            await deleteItemFDB(id);
            return id;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const closeItemOffer = createAsyncThunk(
    'items/closeItemOffer',

    async (id, { rejectWithValue }) => {
        try {
            await closeOffer(id);
            return id;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getClosedUserItems = createAsyncThunk(
    'items/fetchClosedUserItems',
    async (_, { rejectWithValue }) => {
        try {
            const result = await getUserClosedOffers();
            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const makeOffer = createAsyncThunk(
    'items/makeOffer',
    async ({ data, id }, { rejectWithValue }) => {
        try {
            validator(data);
            await addItemBuyer(data, id);

            return {
                data,
                id
            };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const search = createAsyncThunk(
    'items/search',
    async (data, { rejectWithValue }) => {
        try {
            const result = await searchItems(data)
            return { result, data };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = itemsAdapter.getInitialState({
    status: 'idle',
    error: null,
    user: getUser(),
    closedOffers: null,
    oldSkip: undefined,
    oldSearchSkip: undefined,
    oldSearchSkip: undefined,
    oldSearchData: null,
    searchArray: null
});

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setUserToCatalog(state, action) {
            state.user = action.payload;
        },
        clearUserFromCatalog(state, action) {
            state.user = null;
        },
        cleanErrorFromCatalog(state, action) {
            state.error = null;
        },
        setErrorToCatalog(state, action) {
            state.error = action.payload;
        },
        clearClosedOffers(state, action) {
            state.closedOffers = null;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getItems.pending, (state, action) => {
                state.status = 'fetchItemStarted';
            })
            .addCase(getItems.fulfilled, (state, action) => {
                state.status = 'fetchItemsSucceeded';

                state.oldSkip = action.payload.skip;

                itemsAdapter.setAll(state, action.payload.items);
            })
            .addCase(getItems.rejected, (state, action) => {
                state.status = 'fetchItemsFaild';

                state.error = action.payload;
            })
            .addCase(makeOffer.fulfilled, (state, action) => {
                state.status = 'offerSucceeded';

                const { data, id } = action.payload;

                itemsAdapter.updateOne(state, {
                    id: id,
                    changes: {
                        price: data.price,
                        buyer: { id: state.user.id, username: state.user.username }
                    }
                });
            })
            .addCase(makeOffer.rejected, (state, action) => {
                state.status = 'offerFaild';

                state.error = action.payload;
            })
            .addCase(getClosedUserItems.pending, (state, action) => {
                state.status = 'fetchUserClosedOffersStart';
            })
            .addCase(getClosedUserItems.fulfilled, (state, action) => {
                state.status = 'fetchUserClosedOffers';

                state.closedOffers = action.payload.items;
            })
            .addCase(getClosedUserItems.rejected, (state, action) => {
                state.status = 'fetchUserClosedOffersFaild';

                state.error = action.payload;
            })
            .addCase(closeItemOffer.fulfilled, (state, action) => {
                state.status = 'closeItemOfferSucceeded';

                const item = state.entities[action.payload];
                if (state.closedOffers === null) {
                    state.closedOffers = [item];
                } else {
                    state.closedOffers.push(item);
                }
                itemsAdapter.removeOne(state, action.payload);
            })
            .addCase(closeItemOffer.rejected, (state, action) => {
                state.status = 'closeItemOfferFaild';

                state.error = action.payload;
            })
            .addCase(deleteItem.pending, (state, action) => {
                state.status = 'deleteItemStarted';
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.status = 'deleteItemSucceeded';
                itemsAdapter.removeOne(state, action.payload);
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.status = 'deleteItemFaild';

                state.error = action.payload;
            })
            .addCase(editItem.pending, (state, action) => {
                state.status = 'editItemStarted';
            })
            .addCase(editItem.fulfilled, (state, action) => {
                state.status = 'editItemSucceeded';

                itemsAdapter.upsertOne(state, action.payload);
            })
            .addCase(editItem.rejected, (state, action) => {
                state.status = 'editItemFaild';

                state.error = action.payload;
            })
            .addCase(createItem.pending, (state, action) => {
                state.status = 'createItemStarted';
            })
            .addCase(createItem.fulfilled, (state, action) => {
                state.status = 'createItemSucceeded';

                action.payload.imgUrl = action.payload.imgUrl._url;

                itemsAdapter.addOne(state, action.payload);
            })
            .addCase(createItem.rejected, (state, action) => {
                state.status = 'createItemFail';

                state.error = action.payload;
            })
            .addCase(search.pending, (state, action) => {
                state.status = 'searchStarted';
            })
            .addCase(search.fulfilled, (state, action) => {
                state.status = 'searchSucceeded';

                state.oldSearchSkip = action.payload.result.skip;

                state.searchArray = action.payload.result.items;

                state.oldSearchData = action.payload.data;
            })
            .addCase(search.rejected, (state, action) => {
                state.status = 'searchFail';

                state.error = action.payload;
            });
    }
});

export default itemsSlice.reducer;

export const { setUserToCatalog, clearUserFromCatalog, cleanErrorFromCatalog, setErrorToCatalog, clearClosedOffers } = itemsSlice.actions;

export const { selectAll: selectItems, selectById: selectItemById } = itemsAdapter.getSelectors(state => state.items);

// export const getItemByUserId = createSelector(
//     [selectItems, (state, userId) => userId],
//     (items, userId) => items.filter((item) => item.id === userId)
// );

export const selectItemsError = state => state.items.error;

export const selectUserFromCatalog = state => state.items.user;

export const selectClosedOffers = state => state.items.closedOffers;

export const selectItemsStatus = state => state.items.status;

export const selectItemsSkip = state => state.items.oldSkip;

export const selectOldSearchSkip = state => state.items.oldSearchSkip;

export const selectSearchData = state => state.items.oldSearchData;

export const selectSearchArray = state => state.items.searchArray;