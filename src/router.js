import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'; 
import GoogleAuthCallback from './GoogleAuthCallback.vue';

const routes = [
  {
    path: '/',
    component: App, 
  },
  {
    path: '/auth/callback',
    component: GoogleAuthCallback,
  },
  {
    path: '/auth/callback',
    component: { 
      template: '<div>Обработка авторизации...</div>'
    },
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

