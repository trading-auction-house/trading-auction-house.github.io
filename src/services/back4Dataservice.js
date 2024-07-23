import { clearUser, setUser, getUser } from './utility';
import Parse from 'parse/dist/parse.min.js';

Parse.initialize('gyK4yLMJ7Vkdxl10WEuLToXTqtUYiumw8UqPxTmQ', 'Y2Jq1AYuOe08rQbA8rbB3atRQnSEInRgFEFMRGLM');

Parse.serverURL = 'https://parseapi.back4app.com/';


export const back4appApi = () => {

    async function updateItem(data, id) {
        const sessionToken = getUser().sessionToken;
        const query = new Parse.Query('Item');

        let parseFile;

        if (data.imgUrl) {
            const newFileName = `photo.${data.imgUrl.name.split('.')[1]}`;
            parseFile = new Parse.File(newFileName, data.imgUrl);
        }


        try {
            if (parseFile !== undefined) {
                await parseFile.save();
                data.imgUrl = parseFile;
            }

            const item = await query.get(id);

            item.set(data);

            await item.save(null, { sessionToken });

            const updateItem = await query.get(id);

            const itemId = updateItem.id;

            const { title, category, imgUrl, owner, price, description } = updateItem.attributes;

            return { id: itemId, title, category, imgUrl: imgUrl._url, owner: owner.id, price, description };

        } catch (error) {
            throw error.message;
        }
    }

    async function closeOffer(id) {
        const sessionToken = getUser().sessionToken;

        const query = new Parse.Query('Item');

        try {
            const item = await query.get(id);

            item.set('isClosed', true);

            await item.save(null, { sessionToken });

        } catch (error) {
            throw error.message;
        }
    }

    async function addItemBuyer(data, itemId) {
        const currentUser = getUser();

        data.user = currentUser;

        data.id = itemId;

        try {
            await Parse.Cloud.run('check', data);

            await Parse.Cloud.run('addBuyer', data);
        } catch (error) {
            throw error.message;
        }
    }

    async function saveItem(params) {
        const currentUser = getUser();

        const { imgUrl } = params;

        const fileName = `photo.${imgUrl.name.split('.')[1]}`;
        const parseFile = new Parse.File(fileName, imgUrl);

        params.user = currentUser;


        try {
            await parseFile.save();

            params.imgUrl = parseFile;

            await Parse.Cloud.run('check', params);

            const result = await Parse.Cloud.run('saveItem', params);

            const itemId = result.id;

            const { title, category, imgUrl, owner, price, description } = result.attributes;

            const itemOwner = owner.id;

            return { id: itemId, title, category, imgUrl, owner: itemOwner, price, description };
        } catch (error) {
            throw error.message;
        }
    }

    async function getCloudItems() {
        try {
            const result = await Parse.Cloud.run('getItems');

            const data = result.items.map(item => {
                item.imgUrl = item.imgUrl._url;
                return item;
            });

            return data;
        } catch (error) {
            throw error.message;
        }
    }

    async function getUserClosedOffers() {
        const user = getUser();

        try {
            const result = await Parse.Cloud.run('getUserClosedOffers', user);

            return result;
        } catch (error) {
            throw error.message;
        }
    }

    async function deleteItemFDB(id) {
        const sessionToken = getUser().sessionToken;

        const query = new Parse.Query('Item');

        try {
            const item = await query.get(id);

            await item.destroy({ sessionToken });
        } catch (error) {
            throw error.message;
        }
    }


    async function cloudRegister(data) {
        try {
            await Parse.Cloud.run('check', data);

            const result = await Parse.Cloud.run('register', data);

            setUser(result);

            return result;
        } catch (error) {
            throw error.message;
        }
    }


    async function cloudLogin(data) {
        try {
            await Parse.Cloud.run('check', data);

            const result = await Parse.Cloud.run('login', data);

            setUser(result);

            return result;
        } catch (error) {
            throw error.message;
        }
    }


    async function cloudLogout() {
        const params = getUser();

        try {
            const result = await Parse.Cloud.run('logout', params);

            clearUser();

            return result;
        } catch (error) {
            throw error.message;
        }
    }


    return {
        cloudRegister,
        cloudLogin,
        cloudLogout,
        saveItem,
        getCloudItems,
        updateItem,
        addItemBuyer,
        closeOffer,
        getUserClosedOffers,
        deleteItemFDB
    };

};
