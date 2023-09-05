import './assets/main.css'

import { createApp } from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import Toaster from '@meforma/vue-toaster'
import router from './router'
import store from './store'

const app = createApp(App)

app.use(Vuex);
app.use(Toaster, {
    position: 'top-right'
})
app.use(router);
app.use(store);

app.mount('#app');
