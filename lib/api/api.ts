import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/api` 
  : 'https://ac.goit.global/api'; // або ваш резервний URL із додаванням /api

export const api = axios.create({
  baseURL,
  withCredentials: true,
});