import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, registerUser } from "../../services/auth"; 

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Nuevo estado para alternar entre Login y Register
  const [isRegisterMode, setIsRegisterMode] = useState(false); 
  const navigate = useNavigate();

  const handleAuth = async (data: LoginFormData) => {
    setLoading(true);
    setError("");
    
    // 1. Elegir la función de servicio (login o registerUser)
    const serviceFunction = isRegisterMode ? registerUser : login;

    // 2. Ejecutar el servicio
    const result = await serviceFunction({ username: data.username, userpassword: data.password });
    
    setLoading(false);

    // 3. Manejar el resultado (Es el mismo para login y register exitosos)
    if (result.success && result.data) {
      sessionStorage.setItem("usuarioTucuBus", JSON.stringify(result.data));
      if (result.data.role === "Administrador") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      // Usar el mensaje de error del servicio, ajustando el prefijo
      const action = isRegisterMode ? "registrar" : "iniciar sesión";
      setError(result.error || `Error al ${action}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-4 py-16 sm:py-28 bg-background">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 flex flex-col gap-6">
        {/* Título dinámico */}
        <h2 className="text-2xl font-bold text-center text-primary-text">
          {isRegisterMode ? "Registrarse" : "Iniciar sesión"}
        </h2>
        
        {/* El formulario ahora llama a handleAuth */}
        <form onSubmit={handleSubmit(handleAuth)} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-semibold text-sm text-primary-text">Usuario</label>
            <input
              id="username"
              type="text"
              className="border rounded-lg py-2 px-3"
              {...register("username", { required: "Usuario requerido" })}
              autoComplete="username"
            />
            {errors.username && <span className="text-red-600 text-sm">{errors.username.message}</span>}
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold text-sm text-primary-text">Contraseña</label>
            <input
              id="password"
              type="password"
              className="border rounded-lg py-2 px-3"
              {...register("password", { 
                  required: "Contraseña requerida",
                  // Requisito mínimo de longitud solo para el registro
                  minLength: isRegisterMode ? { value: 6, message: "Mínimo 6 caracteres" } : undefined
              })}
              autoComplete={isRegisterMode ? "new-password" : "current-password"}
            />
            {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
          </div>
          
          <button
            type="submit"
            className="mt-2 bg-brand text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? (isRegisterMode ? "Registrando..." : "Ingresando...") : (isRegisterMode ? "Registrar" : "Ingresar")}
          </button>
          
          {error && <span className="text-red-600 text-center text-sm mt-2">{error}</span>}
        </form>
        
        {/* Botón para alternar modo */}
        <button 
          onClick={() => {
            setIsRegisterMode(prev => !prev);
            setError(""); // Limpiar errores al cambiar de modo
          }}
          className="text-sm text-center text-gray-500 hover:text-brand transition"
        >
          {isRegisterMode 
            ? "¿Ya tienes una cuenta? Inicia sesión" 
            : "¿No tienes una cuenta? Regístrate aquí"}
        </button>
      </div>
    </div>
  );
}

export default Login