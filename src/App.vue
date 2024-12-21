<template>
  <div class="app">
    <h1>Список ивентов</h1>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <ul v-else>
      <li v-for="event in events" :key="event.IDev">
        {{ event.Event_name }} {{ event.Event_time }} {{ event.Description }} {{ event.Location }} - {{ event.Is_public }}
        <button v-if="isAuthenticated" @click="editEvents(event)">Изменить</button>
        <button v-if="isAuthenticated" @click="deleteEvent(event.IDev)">Удалить</button>
      </li>
    </ul>

    <h2>Добавить ивент</h2>
    <form v-if="isAuthenticated" @submit.prevent="addEvent">
      <div>
        <label for="Event_name">Название:</label>
        <input type="text" id="Event_name" v-model="newEvent.Event_name" required>
      </div>
      <div>
        <label for="Event_time">Время:</label>
        <input type="text" id="Event_time" v-model="newEvent.Event_time" required>
      </div>
      <div>
        <label for="Description">Описание:</label>
        <input type="text" id="Description" v-model="newEvent.Description" required>
      </div>
      <div>
        <label for="Location">Место:</label>
        <input type="text" id="Location" v-model="newEvent.Location" required>
      </div>
      <div>
        <label for="Is_public">Публичный:</label>
        <input type="checkbox" id="Is_public" v-model="newEvent.Is_public">
      </div>
      <button type="submit">Добавить</button>
    </form>

    <h2>Изменить ивент</h2>
    <form v-if="editingEvent && isAuthenticated" @submit.prevent="updateEvent">
      <div>
        <label for="edit-IDev">ID:</label>
        <input type="text" id="edit-IDev" v-model="editingEvent.IDev" readonly>
      </div>
      <div>
        <label for="edit-Event_name">Название:</label>
        <input type="text" id="edit-Event_name" v-model="editingEvent.Event_name" required>
      </div>
      <div>
        <label for="edit-Event_time">Время:</label>
        <input type="text" id="edit-Event_time" v-model="editingEvent.Event_time" required>
      </div>
      <div>
        <label for="edit-Description">Описание:</label>
        <input type="text" id="edit-Description" v-model="editingEvent.Description" required>
      </div>
      <div>
        <label for="edit-Location">Место:</label>
        <input type="text" id="edit-Location" v-model="editingEvent.Location" required>
      </div>
      <div>
        <label for="edit-Is_public">Публичный:</label>
        <input type="checkbox" id="edit-Is_public" v-model="editingEvent.Is_public">
      </div>
      <button type="submit">Сохранить изменения</button>
    </form>
    <button v-if="!isAuthenticated" @click="googleLogin">Войти с Google</button>
    <button v-if="isAuthenticated" @click="logout">Выйти</button>
    <div v-if="authError" class="error">{{ authError }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      events: [],
      newEvent: { Event_name: '', Event_time: '', Description: '', Location: '', Is_public: false },
      editingEvent: null,
      error: null,
      loading: true,
      jwt: null,
      isAuthenticated: false,
      authError: null,
    };
  },
  mounted() {
    console.log('LocalStorage после перенаправления:', localStorage.getItem('jwt'));
    this.fetchEvents();
    this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      this.jwt = localStorage.getItem('jwt');
      this.isAuthenticated = !!this.jwt;
      if (this.isAuthenticated) this.fetchEvents(); // Fetch events only if logged in
    },
    fetchEvents() {
      this.loading = true;
      this.error = null;
      const config = this.jwt ? { headers: { Authorization: `Bearer ${this.jwt}` } } : {};
      axios.get('http://localhost:8090/api/events', config)
        .then(response => {
          this.events = response.data;
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            this.isAuthenticated = false;
            this.error = "Необходимо авторизоваться";
            localStorage.removeItem('jwt');
          } else {
            this.error = error.message || 'Ошибка при загрузке данных';
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
   googleLogin() {
      window.location.href = "http://localhost:8090/auth";
    },
    handleGoogleAuthCallback(token) {
      console.log('перед сохранением токена:', this.isAuthenticated);
      localStorage.setItem('jwt', token);
      this.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      this.isAuthenticated = true;
      this.fetchEvents();
      console.log('после сохранения токена:', this.isAuthenticated);
    },

    addEvent() {
      const config = this.jwt ? { headers: { Authorization: `Bearer ${this.jwt}` } } : {};
      axios.post('http://localhost:8090/api/events', this.newEvent, config)
        .then(response => {
          this.successMessage = 'Событие успешно добавлено!';
          this.newEvent = { Event_name: '', Event_time: '', Description: '', Location: '', Is_public: false };
          this.fetchEvents();
          setTimeout(() => this.successMessage = null, 3000);
        })
        .catch(error => {
          this.error = error.message || 'Ошибка при добавлении события';
        });
    },
    editEvents(event) {
      this.editingEvent = { ...event };
    },
    updateEvent() {
      const config = this.jwt ? { headers: { Authorization: `Bearer ${this.jwt}` } } : {};
      axios.post(`http://localhost:8090/api/events/${this.editingEvent.IDev}`, this.editingEvent, config)
        .then(() => {
          this.successMessage = 'Событие успешно изменено!';
          this.editingEvent = null;
          this.fetchEvents();
          setTimeout(() => this.successMessage = null, 3000);
        })
        .catch(error => {
          this.error = error.message || 'Ошибка при изменении события';
        });
    },
    deleteEvent(id) {
      const config = this.jwt ? { headers: { Authorization: `Bearer ${this.jwt}` } } : {};
      axios.delete(`http://localhost:8090/api/events/${id}`, config)
        .then(() => {
          this.successMessage = 'Событие успешно удалено!';
          this.fetchEvents();
          setTimeout(() => this.successMessage = null, 3000);
        })
        .catch(error => {
          this.error = error.message || 'Ошибка при удалении события';
        });
    },
    logout() {
      localStorage.removeItem('jwt');
      this.jwt = null;
      this.isAuthenticated = false;
      this.fetchEvents();
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
