<template>
    <div>Обработка авторизации Google... <div v-if="authError">{{ authError }}</div></div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        jwt: null,
        authError: null,
      }
    },
    mounted() {
      this.handleGoogleCallback()
    },
    methods: {
      handleGoogleCallback() {
        axios.get('http://localhost:8090/auth/callback', {
          params: {
            state: this.$route.query.state,
            code: this.$route.query.code
          }
        })
          .then(response => {
            const jwt = response.data.token;
            if (jwt) {
              localStorage.setItem('jwt', jwt);
              this.$router.push('/');
            } else {
              this.authError = "JWT не получен";
            }
          })
          .catch(error => {
            this.authError = "Ошибка авторизации: " + error.message;
          })
      }
    }
  };
  </script>
  
  