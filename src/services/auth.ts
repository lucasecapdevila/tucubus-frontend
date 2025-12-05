import { AuthResponse, LoginCredentials } from "@/types";
import api from "./api";

export const login = async (user: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", {
      username: user.username,
      userpassword: user.userpassword,
    });

    //  Decodificar el token
    const token = response.data.access_token;
    const payload = JSON.parse(atob(token.split(".")[1]));

    //  Devolver datos del usuario
    return {
      success: true,
      data: {
        id: 0,
        username: payload.sub,
        role: payload.role,
        token: token,
      },
    };
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al iniciar sesión"
    };
  }
};

export const registerUser = async (user: LoginCredentials): Promise<AuthResponse> => {
  try {
    await api.post("/auth/register", {
      username: user.username,
      userpassword: user.userpassword,
    });

    //  Al registrar, hacer login automaticamente
    return await login(user);
  } catch (error) {
    console.error("Error al registrar: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al registrar usuario",
    };
  }
};
