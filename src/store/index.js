import { createStore } from 'vuex';
import {authentication} from './modules/authentication.module'
import {campaigns} from "@/store/modules/campaigns.module";

export default createStore({
    state: {
        BASE_URL: 'http://localhost:8080/api/'
    },
    getters: {
        getBaseUrl: (state) => state.BASE_URL
    },
    modules: {
        authentication,
        campaigns
    }
})