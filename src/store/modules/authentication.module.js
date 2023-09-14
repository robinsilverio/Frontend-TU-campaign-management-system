import AuthService from '../../services/auth-service'
import store from '../../store'

const authService = new AuthService();
const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
? { status: { loggedIn: true }, user }
: { status: { loggedIn: false }, user: null };

export const authentication = {
    state: {
        userState: initialState
    },
    getters: {
        getUserState(state) {
            return state.userState
        }
    },
    actions: {
        login({ commit }, paramUser){
            const BASE_URL = store.getters.getBaseUrl;
            return authService.login(paramUser, BASE_URL)
            .then(
                user => {
                    commit('mutateLoginSuccess', user);
                    return Promise.resolve(user);
                },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        logout({ commit }) {
            commit('mutateLogout');
            authService.logout();
        }
    },
    mutations : {
        mutateLoginSuccess(state, user) {
            state.userState.status.loggedIn = true;
            state.userState.user = user;
        },
        mutateLogout(state) {
            state.userState.status.loggedIn = false;
            state.userState.user = null;
        },
    }
}