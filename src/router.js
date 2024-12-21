import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'; // Adjust path if necessary

const routes = [
  {
    path: '/',
    component: App,
    // Add meta for checking authentication status. This is very helpful
    meta: { requiresAuth: true }
  },
  {
    path: '/callback',
    component: {
      name: 'Callback', // optional but helpful for debugging and routing
      mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
          this.$store.dispatch('auth/login', token);
          this.$router.push('/');
        } else {
          console.error("Token not found in callback URL");
          // redirect to error page or handle appropriately
          this.$router.push('/error') //Example
        }
      },
      render() { return null; } // or a loading indicator
    }
  },
    {
    path: '/error',
    component: {
        template: '<div>Authentication error.</div>'
    }
}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
      const store = router.app.$store;
      if (store.getters['auth/isAuthenticated']) {
        next();
      } else {
        await new Promise(resolve => {
          const unsubscribe = store.watch(
            state => state.auth.isAuthenticated,
            (isAuthenticated) => {
              if (isAuthenticated) {
                unsubscribe();
                resolve();
                next();
              } else {
                next('/');
              }
            }
          );
        });
      }
    } else {
      next();
    }
  });

export default router;
