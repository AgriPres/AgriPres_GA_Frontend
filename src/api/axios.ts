import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://agripresgabackend-production.up.railway.app').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});

export default api;