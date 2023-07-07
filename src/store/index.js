import Vue from 'vue'
import Vuex from 'vuex'
import {authentication} from './modules/authentication.module'

Vue.use(Vuex);

export default new Vuex.Store({
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