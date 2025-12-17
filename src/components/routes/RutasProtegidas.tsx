import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom"

interface RutasProtegidasProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const RutasProtegidas: React.FC<RutasProtegidasProps> = ({ 
  children,
  allowedRoles = [UserRole.ADMIN, UserRole.OPERATOR]
}) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if(loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Verificando autenticación...</div>
      </div>
    )
  }

  if(isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if(allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>;
}

export default RutasProtegidas;