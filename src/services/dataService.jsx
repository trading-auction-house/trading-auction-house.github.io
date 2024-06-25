import { clearUser, setUser } from './utility';
import { request } from '../hooks/apiHook';

export const api = () => {
    const { get, post } = request();

    const endpoints = {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        getAllDataInSistem: '/house/catalog',
        getSpecificDataWithId: '/house/details/',
        addInSysten: '/house/create',
        edit: '/house/edit/',
        delete: '/house/delete/',
        closed: '/house/closed',
        action: '/house/userAction/',
        createNot: '/notification/createNotice',
        getAllNotices: '/notification/notices',
        getNotice: '/notification/notice/',
        noticeAnswer: '/notification/answer',
        deleteNotice: '/notification/notice/',
        editNotice: '/notification/editNotice/',
    };

    async function login(data) {
        const result = await post(endpoints.login, data);
        setUser(result.token);
        return result.user;
    }


    async function register(data) {
        const result = await post(endpoints.register, data);
        setUser(result.token);
        return result.user;
    }

    async function logout() {
        const result = get(endpoints.logout);
        clearUser();
        return result;
    }

    async function getAllDataInSystem(signal) {
        const result = await get(endpoints.getAllDataInSistem, undefined, signal);
        return result;
    }

    async function getSpecificDataWithId(id) {
        const result = await get(endpoints.getSpecificDataWithId + id);
        return result;
    }

    async function offer(data, id) {
        const result = await post(endpoints.getSpecificDataWithId + id, data);
        return result;
    }

    async function onEdit(data, id) {
        const result = await post(endpoints.edit + id, data);
        return result;
    };
   
    async function addInSystem(data) {
        const result = await post(endpoints.addInSysten, data);
        return result;
    }

    async function onDelete(id) {
        const result = await get(endpoints.delete + id);
        return result;
    }

    async function makeAction(specificId) {
        const result = await post({ specificId });
        return result;
    }

    async function getTotalAction() {
        const result = await get(endpoints.closed);
        return result;
    }

    async function getUserAction(id) {
        const result = await get(endpoints.action + id);
        return result;
    }

    async function createNotification(data) {
        const result = await post(endpoints.createNot, data);
        return result;
    }

    async function noticeAnswer(data){
        await post(endpoints.noticeAnswer, data);
    }

    async function getAllNotices() {
        const result = await get(endpoints.getAllNotices);
        return result;
    }

    async function getNotice(id) {
        const result = await get(endpoints.getNotice + id);
        return result;
    }

    async function editNotice(data, id) {
        const result = await post(endpoints.editNotice + id);
        return result;
    }

    async function deleteNotice(id) {
        await get(endpoints.deleteNotice + id);
    }

    return {
        login,
        register,
        logout,
        getAllDataInSystem,
        getSpecificDataWithId,
        offer,
        onEdit, addInSystem,
        onDelete,
        makeAction,
        getTotalAction,
        getUserAction,
        createNotification,
        getAllNotices,
        getNotice,
        deleteNotice,
        editNotice,
        noticeAnswer
    };
};