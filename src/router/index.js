import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import AccessDenied from "@/views/AccessDenied.vue";
import store from "@/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
})

export default router

// This is for handling unauthorized access.
router.beforeEach((to, from, next) => {
  const publicPages = ['/'];
  const authRequired = !publicPages.includes(to.path);
  const userState = store.getters.getUserState;
  const adminRole = 'ROLE_SUPER_USER_E-SALES';

  if (authRequired && !userState.status.loggedIn) {
    next('/');
  } else if (userState.status.loggedIn && to.path === '/') {
    next('/admin');
  } else if (authRequired && !userState.user.roles.includes(adminRole) && to.path !== '/access-denied') {
    next('/access-denied');
  } else {
    next();
  }

});
