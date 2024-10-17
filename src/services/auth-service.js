import axios from 'axios';
import Cookies from 'js-cookie';
import store from '../store';

export default class AuthService {

    login(paramUser, paramBaseUrl) {
        const API_URL = paramBaseUrl;
        return axios
            .post(API_URL + 'auth/signin', {
                username: paramUser.username,
                password: paramUser.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(success => {
                return Promise.resolve(success);
            })
            .catch(error => {
                throw error;
            })
    }
}