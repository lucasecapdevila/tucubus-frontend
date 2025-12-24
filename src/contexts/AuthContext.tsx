import { User, UserRole } from '@/types';
import { AuthContextType } from '@/types/authContext.types'
import { createContext, ReactNode, useCallback, useEffect, useState } from 'react'
import * as authService from '../services/auth'

const AuthContext = createContext<AuthContextType | undefined> (undefined) 

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    setLoading(true)
    
    try {
      const storedToken = authService.getStoredToken()
      const storedUser = authService.getStoredUser()

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(storedUser)

        const result = await authService.getCurrentUser();
        if (result.success && result.data) {
          setUser(result.data);
        } else {
          // Token inválido, limpiar sesión
          handleLogout();
        }
      }
    } catch (error) {
      console.error("Error al verificar la autenticación: ", error);
      handleLogout();
    } finally {
      setLoading(false)
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const result = await authService.login({ email, password });
      
      if (result.success && result.data) {
        setUser(result.data);
        setToken(authService.getStoredToken());
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error || "Error al iniciar sesión" 
        };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return { 
        success: false, 
        error: "Error inesperado al iniciar sesión" 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (
    name: string, 
    email: string, 
    password: string, 
    phone?: string
  ) => {
    setLoading(true);
    
    try {
      const result = await authService.registerUser({ name, email, password, phone });
      
      if (result.success && result.data) {
        setUser(result.data);
        setToken(authService.getStoredToken());
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error || "Error al registrar usuario" 
        };
      }
    } catch (error) {
      console.error("Error en registro:", error);
      return { 
        success: false, 
        error: "Error inesperado al registrar" 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    handleLogout();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const hasRole = useCallback((roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user]);

  const isAdmin = useCallback((): boolean => {
    return hasRole([UserRole.ADMIN, UserRole.OPERATOR]);
  }, [hasRole]);

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    loading,
    
    login,
    register,
    logout,
    checkAuth,
    
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext