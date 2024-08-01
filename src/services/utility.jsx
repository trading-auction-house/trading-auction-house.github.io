const item = 'user';

export function getUser() {
    try {
        return JSON.parse(localStorage.getItem(item));
    } catch (error) {
        return undefined;
    }
};

export function setUser(data) {
    return localStorage.setItem(item, JSON.stringify(data));
};

export function clearUser() {
    localStorage.removeItem(item);
};

export function formHandller(callback) {
    return function (event) {
        event.preventDefault();
        const myForm = new FormData(event.target);
        const data = Object.fromEntries(myForm.entries());

        callback(data, event);
    };
};

export function getSearch() {
    try {
        return JSON.parse(sessionStorage.getItem('search'));
    } catch (error) {
        return undefined;
    }
};

export function setSearch(data) {
    return sessionStorage.setItem('search', JSON.stringify(data));
};

export function getSearchData(){
    try {
        return JSON.parse(sessionStorage.getItem('searchData'));
    } catch (error) {
        return undefined;
    }
}

export function setSearchData(data) {
    return sessionStorage.setItem('searchData', JSON.stringify(data));
};


export const validator = (value) => {
    let error;
    const arrOfCategories = ['vehicles', ' real', 'estate', 'electronics', 'furniture', 'other'];

    const REGEX_FOR_Email = /^[A-Za-z]+@[A-Za-z]+\.[A-Za-z]+$/m;

    const { title, category, price, description, email, username, password, repass, oldPrice } = value;

    if (Object.values(value).some(x => x === '')) {
        error = ['All fields are required.'];
        throw error;
    }


    if (email) {
        if (!REGEX_FOR_Email.test(email)) {
            error = ['Incorect email!'];
            throw error;
        }
    }

    if (username) {
        if (username.length < 2) {
            error = ['First name must be at least 2 characters!'];
            throw error;
        }
    }


    if (password) {
        if (password.length < 5) {
            error = ['Password must be at least 5 characters!'];
            throw error;
        }
    }

    if (password && repass) {
        if (password !== repass) {
            error = ['The passwords do not match!'];
            throw error;
        }
    }

    if (title) {
        if (title.length < 4) {
            error = ['Title must be at least 4 characters.'];
            throw error;
        }
    }

    if (category) {
        if (!arrOfCategories.includes(category)) {
            error = ['It is not in the list of categories.'];
            throw error;
        }
    }

    if (price) {
        if (Number(price) <= 0) {
            error = ['This price cannot be real.'];
            throw error;
        }
    }

    if (oldPrice) {
        if (Number(price) <= Number(oldPrice)) {
            error = ['Your price should be higher see existing.'];
            throw error;
        }
    }

    if (description) {
        if (description.length > 200) {
            error = ['Description must be at most 200 characters.'];
            throw error;
        }
    }

};