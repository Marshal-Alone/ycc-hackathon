import axios from 'axios';

// const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL  });
console.log("Backend on : ",API.defaults.baseURL)

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;