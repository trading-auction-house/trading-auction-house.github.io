import { getUser, clearUser } from '../services/utility';


export const back4AppRequest = () => {

    const host = 'https://parseapi.back4app.com';

    const controller = new AbortController();

    async function request(method, url, data, signal) {
        const user = getUser();

        const options = {
            method,
            headers: {
                'X-Parse-Application-Id': 'gyK4yLMJ7Vkdxl10WEuLToXTqtUYiumw8UqPxTmQ',
                'X-Parse-REST-API-Key': 'ahmyVHihNJ9b1LZpC2yqgqSnGABdaMbb6mqlXff8',
                'X-Parse-Revocable-Session': 1
            },
            signal: controller.signal
        };

        if (signal !== undefined) {
            options.signal = signal;
        }

        if (user != null) {
            options.headers['X-Parse-Session-Token'] = user.sessionToken;
        }

        if (data !== undefined) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(host + url, options);
            let result;

            if (response.status !== 204) {
                result = await response.json();
            }

            if (response.ok === false) {

                if (response.status === 403) {
                    clearUser();
                }

                const err = result;

                throw err;
            }

            return result;


        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    return {
        get: request.bind(null, 'get'),
        post: request.bind(null, 'post'),
        put: request.bind(null, 'put'),
        del: request.bind(null, 'delete'),
    };

};

