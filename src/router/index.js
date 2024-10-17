import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import AccessDenied from "@/views/AccessDenied.vue";
import store from "@/store";
import getAuthorizationToken from '../services/auth-header-service';
import axios from 'axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      alias: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Not found',
      component: NotFoundView
    },
    {
      path: '/access-denied',
      name: 'Access denied',
      component: AccessDenied
    }
  ]
});

const validateJwt = async(token) => {     
  return await axios.get(`${store.getters.getBaseUrl}auth/validateJwt?paramToken=${token}`)
  .then(res =>  res.status === 200 ? res.data.roles[0] : '')
  .catch(err => '');
}

// This is for handling unauthorized access.
router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/home'];
  const authRequired = !publicPages.includes(to.path);
  const rolesAllowed = ['ROLE_SUPER_USER_E-SALES'];
  const token = getAuthorizationToken();
  
  if (token) {
    validateJwt(token.split(" ")[1])
    .then(response => {
      if (to.path === '/' && rolesAllowed.includes(response)) {
        next('/admin');
      }
      if (to.path === '/admin' && !rolesAllowed.includes(response)) {
        return next('/access-denied');
      }
      next();
    });
  } else if (!token && authRequired) {
    next('/');
  } else {
    next();    
  }

});

export default router