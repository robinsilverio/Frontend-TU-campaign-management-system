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
                localStorage.setItem(
                    'user', JSON.stringify(
                        { username: response.data.username, roles: response.data.roles, isLoggedIn: true }
                    )
                );
                Cookies.set('jwtToken', response.data.token, {
                    expires: 7, // Set the expiration time for the cookie (in days)
                    secure: true, // Make it secure (HTTPS-only)
                    sameSite: 'strict', // Set the same-site attribute for additional security
                });
            })
            .catch(error => {
                throw error;
            })
    }
    
    logout() {
      localStorage.removeItem('user');
    }
}