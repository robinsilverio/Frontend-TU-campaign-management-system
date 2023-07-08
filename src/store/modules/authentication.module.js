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
            state.status.loggedIn = true;
            state.user = user;
        },
        mutateLogout(state) {
            console.log("Loggin out");
            state.status.loggedIn = false;
            state.user = null;
        },
    }
}