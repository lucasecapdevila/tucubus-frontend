import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_LOCALHOST,
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
