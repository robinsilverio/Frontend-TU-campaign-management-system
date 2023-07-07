import AuthService from '../../services/auth-service'
import store from '../../store'

const authService = new AuthService();
const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
? { status: { loggedIn: true }, user }
: { status: { loggedIn: false }, user: null };

export const authentication = {
    state: initialState,
    actions: {
        login({ commit }, paramUser){
            const BASE_URL = store.getters.getBaseUrl;
            return authService.login(paramUser, BASE_URL)
            .then(
                user => {
                    // commit('loginSuccess', user);
                    return Promise.resolve(user);
                },
                error => {
                    // commit('loginFailure');
                    return Promise.reject(error);
                }
            );
        },
        logout({ commit }) {
            authService.logout()
        }
    }
}