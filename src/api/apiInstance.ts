// src/api.ts
import axios from "axios";
import { useAuthStore } from "../store/authStore";
// const apiUrl = import.meta.env.VITE_API_URL;
// Create an Axios instance
const instance = axios.create({
  baseURL: import.meta.env.BACK_END || "http://localhost:3000",
});

instance.interceptors.request.use(
  (config) => {
    // Get token from Zustand store directly
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
