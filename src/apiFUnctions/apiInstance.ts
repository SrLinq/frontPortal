// src/api.ts
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
// Create an Axios instance
const instance = axios.create({
  baseURL: apiUrl,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
