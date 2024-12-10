<template>
    <div class="app">
      <h1>Список ивентов</h1>
      <div v-if="loading">Загрузка...</div>
      <div v-else-if="error">{{ error.message }}</div>
      <ul v-else>
        <li v-for="event in events" :key="event.IDev">
          {{ event.Event_name }} {{ event.Event_time }} {{ event.Description }} {{ event.Location }} - {{ event.Is_public }}
          <button @click="editEvents(event)">Изменить</button>
          <button @click="deleteEvent(event.IDev)">Удалить</button>
        </li>
      </ul>
  
      <h2>Добавить ивент</h2>
      <form @submit.prevent="addEvent">
        <div>
          <label for="Event_name">Название:</label>
          <input type="text" id="Event_name" v-model="newEvent.Event_name" required>
        </div>
        <div>
          <label for="Event_time">Время:</label>
          <!--<input type="datetime-local" id="Event_time" v-model="newEvent.Event_time" required> -->
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
      <form v-if="editingEvent" @submit.prevent="updateEvent">
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
          <!-- <input type="datetime-local" id="edit-Event_time" v-model="editingEvent.Event_time" required>-->
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      events: [],
      newEvent: { IDus: 1, Event_name: '', Event_time: '', Description: '', Location: '', Is_public: false },
      editingEvent: null,
      error: null,
      loading: true,
      successMessage: null
    };
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    fetchEvents() {
      this.loading = true;
      this.error = null;
      axios.get('http://localhost:8090/api/events')
        .then(response => {
          this.events = response.data;
        })
        .catch(error => {
          this.error = error.message || 'Ошибка при загрузке данных';
        })
        .finally(() => {
          this.loading = false;
        });
    },  
    addEvent() {
        // const date = new Date(this.newEvent.Event_time);
        // const formattedDate = date.toISOString().slice(0, 19) + "Z"; 

        // this.newEvent.Event_time = formattedDate;

        axios.post('http://localhost:8090/api/events', this.newEvent)
        .then(response => {
          this.successMessage = 'Событие успешно добавлено!';
          this.newEvent = { IDus: 1, Event_name: '', Event_time: '', Description: '', Location: '', Is_public: false };
          this.fetchEvents();
          setTimeout(() => this.successMessage = null, 3000); 

        })
        .catch(error => {
          this.error = error.message || 'Ошибка при добавлении события';
        });
    },
    editEvents(event) {
      this.editingEvent = { ...event };
      //мб тут ошибка?
      //this.editingEvent.Event_time = new Date(this.editingEvent.Event_time).toISOString().slice(0, 16);

    },
    updateEvent() {
        axios.post(`http://localhost:8090/api/events/${this.editingEvent.IDev}`, this.editingEvent)
            .then(response => {
            this.successMessage = 'Событие успешно изменено!'; // Исправлено сообщение
            this.editingEvent = null; // Сброс формы после обновления
            this.fetchEvents();
            setTimeout(() => this.successMessage = null, 3000);
            })
            .catch(error => {
            this.error = error.response ? error.response.data.error || error.response.data : error.message || 'Ошибка при изменении события'; //Обработка ошибок
            });
        },
//   const date = new Date(this.editingEvent.Event_time);
//   const formattedDate = date.toISOString().slice(0, 19) + "Z"; // мб тут ошибка

//   this.editingEvent.Event_time = formattedDate;

//   axios.patch(`http://localhost:8090/api/events/${this.editingEvent.IDev}`, this.editingEvent)
//         .then(() => {
//           this.successMessage = 'Событие успешно обновлено!';
//           this.editingEvent = null;
//           this.fetchEvents();
//           setTimeout(() => this.successMessage = null, 3000); 
//         })
//         .catch(error => {
//           this.error = error.message || 'Ошибка при обновлении события';
//         });
//     },
    deleteEvent(id) {
      axios.delete(`http://localhost:8090/api/events/${id}`)
        .then(() => {
          this.successMessage = 'Событие успешно удалено!';
          this.fetchEvents();
          setTimeout(() => this.successMessage = null, 3000); 
        })
        .catch(error => {
          this.error = error.message || 'Ошибка при удалении события';
        }); 
    }
  }
};
</script>
