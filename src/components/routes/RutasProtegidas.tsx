import { User } from "@/types";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom"

interface RutasProtegidasProps {
  children: ReactNode;
}

const RutasProtegidas: React.FC<RutasProtegidasProps> = ({ children }) => {
  const storedUser = sessionStorage.getItem('usuarioTucuBus')
  const admin: User | null = storedUser ? JSON.parse(storedUser) : null
  
  if (!admin){
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default RutasProtegidas