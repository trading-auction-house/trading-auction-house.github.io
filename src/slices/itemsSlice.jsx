import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

import { validator, getUser } from '../services/utility';

import { back4appApi } from '../services/back4Dataservice';

const itemsAdapter = createEntityAdapter();

const { getCloudItems, saveItem, updateItem, addItemBuyer, closeOffer, getUserClosedOffers, deleteItemFDB } = back4appApi();

export const getItems = createAsyncThunk(
    'items/fetchItems',
    async (_, { rejectWithValue }) => {
        try {
            const items = await getCloudItems();
            return items;
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

            await updateItem(data, id);

            data.id = id;

            return { ...data };
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

const initialState = itemsAdapter.getInitialState({
    status: 'idle',
    error: null,
    user: getUser(),
    closedOffers: null
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
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getItems.fulfilled, (state, action) => {
                state.status = 'fetchItemsSucceeded';

                itemsAdapter.addMany(state, action.payload.items);

                if (action.payload.user) {
                    state.user.id = action.payload.user;
                }
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
                    state.closedOffers = [item]
                } else {
                    state.closedOffers.push(item)
                }
                itemsAdapter.removeOne(state, action.payload);
            })
            .addCase(closeItemOffer.rejected, (state, action) => {
                state.status = 'closeItemOfferFaild';

                state.error = action.payload;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.status = 'deleteItemSucceeded';
                itemsAdapter.removeOne(state, action.payload);
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.status = 'deleteItemFaild';

                state.error = action.payload;
            })
            .addCase(editItem.fulfilled, (state, action) => {
                state.status = 'editItemSucceeded';

                itemsAdapter.upsertOne(state, action.payload);
            })
            .addCase(editItem.rejected, (state, action) => {
                state.status = 'editItemFaild';

                state.error = action.payload;
            })
            .addCase(createItem.fulfilled, (state, action) => {
                state.status = 'createItemSucceeded';

                itemsAdapter.addOne(state, action.payload);
            })
            .addCase(createItem.rejected, (state, action) => {
                state.status = 'createItemSucceeded';

                state.error = action.payload;
            });


    }
});

export default itemsSlice.reducer;

export const { setUserToCatalog, clearUserFromCatalog, cleanErrorFromCatalog, setErrorToCatalog } = itemsSlice.actions;

export const { selectAll: selectItems, selectById: selectItemById } = itemsAdapter.getSelectors(state => state.items);

// export const getItemByUserId = createSelector(
//     [selectItems, (state, userId) => userId],
//     (items, userId) => items.filter((item) => item.id === userId)
// );

export const selectItemsError = state => state.items.error;

export const selectUserFromCatalog = state => state.items.user;

export const selectClosedOffers = state => state.items.closedOffers;
