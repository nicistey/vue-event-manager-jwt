import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);
app.use(router).use(store);

window.addEventListener('beforeunload', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        app.config.globalProperties.$handleGoogleAuthCallback = function(token){
            app.config.globalProperties.$store.dispatch('auth/login', token).then(() => {
                app.config.globalProperties.$nextTick(() => { // Ждем обновления состояния
                    app.config.globalProperties.$router.push('/');
                    window.removeEventListener('beforeunload', arguments.callee);
                });
            }).catch(error => {
                console.error("Ошибка при логине:", error);
                // Обработка ошибки
                app.config.globalProperties.$router.push('/error');
            });
        }
        app.config.globalProperties.$handleGoogleAuthCallback(token)
    }
});

app.mount('#app');
