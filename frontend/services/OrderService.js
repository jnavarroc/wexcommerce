import axios from 'axios';
import Env from '../config/env.config';
import UserService from './UserService';

export default class OrderService {

    static createOrder(user, order) {
        const data = { user, order };

        return axios.post(`${Env.API_HOST}/api/create-order`, data).then(res => res.status);
    }

    static getOrder(context, orderId) {
        return axios.get(`${Env.API_HOST}/api/order/${orderId}`, { headers: UserService.authHeader(context) }).then(res => res.data);
    }

    static getOrders(context, userId, page, size, keyword, paymentTypes, statuses, from, to) {
        const data = { paymentTypes, statuses, from: from || null, to: to || null };

        return axios.post(
            `${Env.API_HOST}/api/orders/${userId}/${page}/${size}${(keyword !== '' && `/?s=${encodeURIComponent(keyword)}` || '')}`
            , data
            , { headers: UserService.authHeader(context) }).then(res => res.data);
    }

}