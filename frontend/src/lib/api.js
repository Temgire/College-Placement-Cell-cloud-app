// frontend/src/lib/api.js
import axios from 'axios';

// Create an Axios instance with the base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // This will pull from environment variables
  withCredentials: true, // Include credentials (cookies) in requests
});

export default API;
