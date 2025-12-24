import { User, UserRole } from "./models.types";

export interface AuthContextType {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Acciones
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  
  // Utilidades
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
}