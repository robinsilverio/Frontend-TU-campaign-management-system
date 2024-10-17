import AuthService from '../../services/auth-service'
import store from '../../store'
import Cookies from 'js-cookie'

const authService = new AuthService();

export const authentication = {
    state: {
        userState: { status: { loggedIn: !!Cookies.get('jwtToken') } }
    },
    getters: {
        getUserState(state) {
            return state.userState
        },
        isAuthenticated(state) {
            return state.userState.loggedIn;
        }
    },
    actions: {
        login({ commit }, paramUser){
            const BASE_URL = store.getters.getBaseUrl;
            return authService.login(paramUser, BASE_URL)
            .then(
                success => {
                    commit('mutateLoginSuccess', success.data.token);
                    return Promise.resolve(success);
                },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        logout({ commit }) {
            commit('mutateLogout');
        }
    },
    mutations : {
        mutateLoginSuccess(state, paramToken) {
            Cookies.set('jwtToken', paramToken, {
                expires: 3,
                secure: true,
            });
            state.userState.status.loggedIn = true;
        },
        mutateLogout(state) {
            Cookies.remove('jwtToken');
            state.userState.status.loggedIn = false;
        },
    }
}