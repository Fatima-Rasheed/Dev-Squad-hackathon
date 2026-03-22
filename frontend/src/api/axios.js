import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend-ten-green-77.vercel.app/api', // include /api
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;