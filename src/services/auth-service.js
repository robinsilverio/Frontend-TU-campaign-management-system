import axios from 'axios';
import Cookies from 'js-cookie';

export default class AuthService {

    login(paramUser, paramBaseUrl) {
        // Work in progress...
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
            .then(response => {
                let user = { username: response.data.username, roles: response.data.roles, loggedIn: true };
                Cookies.set('jwtToken', response.data.token, {
                    expires: 3, // Set the expiration time for the cookie (in days)
                    secure: true, // Make it secure (HTTPS-only)
                });
                Cookies.set('user', JSON.stringify(user), {
                    expires: 3,
                    secure: true
                });
                return Promise.resolve(user);
            })
            .catch(error => {
                throw error;
            })
    }
    
    logout() {
        Cookies.remove('jwtToken');
        Cookies.remove('user');
    }
}