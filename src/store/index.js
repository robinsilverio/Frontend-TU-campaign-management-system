import { createStore } from 'vuex';
import {authentication} from './modules/authentication.module'

export default createStore({
    state: {
        BASE_URL: 'http://localhost:8080/'
    },
    getters: {
        getBaseUrl: (state) => state.BASE_URL
    },
    modules: {
        authentication
    }
})