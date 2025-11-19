import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

//  Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(sessionStorage.getItem("usuarioTucuBus"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
