import { AuthServiceResponse, LoginDto, RegisterDto, User } from "@/types";
import api from "./api";

export const login = async (credentials: LoginDto): Promise<AuthServiceResponse> => {
  try {
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    const { access_token, user } = response.data;

    sessionStorage.setItem("token", access_token);
    sessionStorage.setItem("user", JSON.stringify(user));

    return {
      success: true,
      data: user
    };
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al iniciar sesión"
    };
  }
};

export const registerUser = async (userData: RegisterDto): Promise<AuthServiceResponse> => {
  try {
    await api.post("/auth/register", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
    });

    return await login({
      email: userData.email,
      password: userData.password
    });
  } catch (error) {
    console.error("Error al registrar: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al registrar usuario",
    };
  }

};

export const logout = (): void => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

export const getStoredToken = (): string | null => {
  return sessionStorage.getItem("token");
};

export const getStoredUser = (): User | null => {
  const userStr = sessionStorage.getItem("user");
  if(!userStr) return null;
  
  try{
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error("Error al obtener el usuario almacenado:", error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getStoredToken();
  const user = getStoredUser();
  return !!(token && user);
};

export const getCurrentUser = async(): Promise<AuthServiceResponse> => {
  try {
    const response = await api.get<User>("/auth/me");

    sessionStorage.setItem("user", JSON.stringify(response.data));

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Error al obtener el usuario actual: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener el usuario actual"
    };
  }
}