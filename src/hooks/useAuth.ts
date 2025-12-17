import { AuthContext } from "@/contexts";
import { AuthContextType } from "@/types/authContext.types";
import React from "react";

/**
 * Hook para acceder al contexto de autenticación
 * @throws Error si se usa fuera del AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  
  return context;
};