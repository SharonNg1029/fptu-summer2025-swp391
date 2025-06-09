import axios from "axios";

// Set config defaults when creating the instance
const api = axios.create({
  baseURL: "http://192.168.102.184:8080/api",
});

api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
