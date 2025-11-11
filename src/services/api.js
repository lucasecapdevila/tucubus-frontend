import axios from "axios";

const api = axios.create({
  //!  Luego reemplazar con backend deployado
  baseURL: import.meta.env.VITE_LOCALHOST,
});

export default api;
