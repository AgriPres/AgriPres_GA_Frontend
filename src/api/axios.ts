import axios from 'axios';

const api = axios.create({
  baseURL: 'https://agripresgestionesagricolas.up.railway.app/', 
  withCredentials: true // Esto hace que el navegador incluya la cookie automáticamente
});

export default api;