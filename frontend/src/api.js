// frontend/src/api.js
import axios from 'axios';

// This checks if you are on localhost or Vercel and picks the right URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

export default api;
