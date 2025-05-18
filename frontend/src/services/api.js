// 

import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api', // or your backend URL
  baseURL: 'https://tasklist-nodejs-b6nt.onrender.com/api',
});

// Add an interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
