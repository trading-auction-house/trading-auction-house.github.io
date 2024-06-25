import { clearUser, setUser, getUser } from './utility';
import Parse from 'parse/dist/parse.min.js';

Parse.initialize('gyK4yLMJ7Vkdxl10WEuLToXTqtUYiumw8UqPxTmQ', 'Y2Jq1AYuOe08rQbA8rbB3atRQnSEInRgFEFMRGLM');

Parse.serverURL = 'https://parseapi.back4app.com/';


export const back4appApi = () => {

    async function updateItem(data, id) {
        const sessionToken = getUser().sessionToken;

        const query = new Parse.Query('Item');

        try {
            const item = await query.get(id);

            item.set(data);

            await item.save(null, { sessionToken });

        } catch (error) {
            console.log(error)
            throw error.message;
        }
    }

    async function closeOffer(id) {
        const sessionToken = getUser().sessionToken;

        const query = new Parse.Query('Item');

        try {
            const item = await query.get(id)

            item.set('isClosed', true)

            await item.save(null, { sessionToken })

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

        params.user = currentUser;

        try {
            await Parse.Cloud.run('check', params);

            const result = await Parse.Cloud.run('saveItem', params);

            const itemId = result.id;

            const { title, category, imgUrl, owner, price } = result.attributes;

            const itemOwner = owner.id;

            return { id: itemId, title, category, imgUrl, owner: itemOwner, price };
        } catch (error) {
            throw error.message;
        }
    }

    async function getCloudItems() {
        try {
            const result = await Parse.Cloud.run('getItems');
            return result;
        } catch (error) {
            throw error.message;
        }
    }

    async function getUserClosedOffers(){
        const user = getUser();

        try {
            const result = await Parse.Cloud.run('getUserClosedOffers', user)
            return result;
        } catch (error) {
            throw error;
        }
    }

    async function deleteItemFDB(id){
        const sessionToken = getUser().sessionToken;

        const query = new Parse.Query('Item');

        try {
            const item = await query.get(id);

            await item.destroy( {sessionToken})
        } catch (error) {
            throw error.message;
        }
    }



  // Person 
    async function removeField(id, field) {
        const query = new Parse.Query('Person');
        try {
            const person = await query.get(id);
            person.unset(field);
            await person.save();
        } catch (error) {
            console.log(error.message);
        }
    }


    /// Query -->

    async function matchesKeyInQuery() {
        const User = Parse.Object.extend('_User');
        const userQuery = new Parse.Query(User);
        userQuery.equalTo('username', 'Peter');

        const itemQuery = new Parse.Query('Item');
        // сравнява стойноста на owner  с тази на objectId от _User и връща съответния/те запис/и от Item.
        itemQuery.matchesKeyInQuery('owner', 'objectId', userQuery);
        try {
            const result = await itemQuery.find();
            return result;
        } catch (error) {
            console.log(error.message);
        }
    }

    async function matchesKeyInQueryBack(category) {
        const User = Parse.Object.extend('_User');
        const userQuery = new Parse.Query(User);

        const itemQuery = new Parse.Query('Item');
        itemQuery.equalTo('category', category);
        // сравнява стойноста на objectId  с тази върната от owner.objectId и връща съответния потребител
        userQuery.matchesKeyInQuery('objectId', 'owner.objectId', itemQuery);
        try {
            const result = await userQuery.find();
            return result;
        } catch (error) {
            console.log(error.message);
        }
    }

    async function selectQuery(field) {
        const query = new Parse.Query('_User');
        // служи за да избере само определени полета от даден клас.
        query.select(field);

        try {
            const result = await query.find();
            console.log(result[0].attributes);
            return result;
        } catch (error) {
            console.log(error.message);
        }
    }

    // login register logout with parse


    async function cloudRegister(data) {
        try {
            await Parse.Cloud.run('check', data);

            const result = await Parse.Cloud.run('register', data);

            setUser(result)

            return result;
        } catch (error) {
            throw error.message;
        }
    }



    async function cloudLogin(data) {
        try {
            await Parse.Cloud.run('check', data);

            const result = await Parse.Cloud.run('login', data)

            setUser(result)

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

    // Role Schema

    async function createRole(userId) {
        const usersToAddToRole = new Parse.Query('_User');
        const user = await usersToAddToRole.get(userId);

        const roleACL = new Parse.ACL();

        roleACL.setPublicReadAccess(true);

        const role = new Parse.Role('owner', roleACL);
        role.getUsers().add(user);
        try {
            const result = await role.save();
            return result;
        } catch (error) {
            console.log(error.message);
        }
    }

    async function retrieveRole(userId) {
        const role = new Parse.Query('_Role');
        role.equalTo('name', 'owner');
        try {
            const result = await role.first();
            return result;
        } catch (error) {
            console.log(error.message);
        }
    }

    async function getShema() {
        try {
            const result = await Parse.Cloud.run('getSchema');
            console.log(result);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    return {
        removeField,
        matchesKeyInQuery,
        matchesKeyInQueryBack,
        selectQuery,
        cloudRegister,
        cloudLogin,
        cloudLogout,
        createRole,
        retrieveRole,
        getShema,
        saveItem,
        getCloudItems,
        updateItem,
        addItemBuyer,
        closeOffer,
        getUserClosedOffers,
        deleteItemFDB
    };

};
