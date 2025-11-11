import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_LOCALHOST,
});

export default api;
