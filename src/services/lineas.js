import api from "./api";

export const getLineas = async () => {
  try {
    const { data } = await api.get("/lineas");
    return data;
  } catch (error) {
    console.log(error);
  }
};
