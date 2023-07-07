import axios from 'axios'

export default class AuthService {

    login(paramUser, paramBaseUrl) {
        // Work in progress...
        const API_URL = paramBaseUrl;
        const response = axios
        .post(API_URL + 'auth/signin', {
            username: paramUser.username,
            password: paramUser.password
        }, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            return response.data;
          })
          .catch(error => {
            throw error;
          });
        return response
    }
    logout() {

    }
}