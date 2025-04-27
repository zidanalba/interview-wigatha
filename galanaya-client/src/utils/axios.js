import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Tambahkan token ke setiap request
api.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem("auth"));

  if (authData?.access_token) {
    config.headers.Authorization = `Bearer ${authData.access_token}`;
  }

  return config;
});

export default api;
