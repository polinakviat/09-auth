import axios from 'axios';

export const api = axios.create({
  baseURL: '', // Маршрути доступні за відносним шляхом /api/
  withCredentials: true, // Передає кукі авторизації з кожним запитом
});