import { createStore } from 'vuex';

export default createStore({
  modules: {
    auth: {
      namespaced: true,
      state: {
        token: null,
        isAuthenticated: false,
      },
      mutations: {
        SET_TOKEN(state, token) {
          state.token = token; // Сначала устанавливаем состояние в store
          localStorage.setItem('jwt', token); // Затем сохраняем в localStorage
          state.isAuthenticated = !!token; // И только потом обновляем isAuthenticated
        },
        LOGOUT(state) {
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('jwt');
        },
      },
      actions: {
        login({ commit }, token) {
          commit('SET_TOKEN', token);
        },
        logout({ commit }) {
          commit('LOGOUT');
        },
      },
      getters: {
        isAuthenticated(state) {
          return state.isAuthenticated;
        },
      },
    },
  },
});
