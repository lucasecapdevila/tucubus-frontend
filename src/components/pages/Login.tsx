import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, registerUser } from "../../services/auth"; 
import { LoginDto, RegisterDto, UserRole } from "@/types";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData extends LoginFormData {
  name: string;
  phone?: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormData>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false); 
  const navigate = useNavigate();

  const redirectByRole = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
      case UserRole.OPERATOR:
        navigate("/admin");
        break;
      case UserRole.DRIVER:
      case UserRole.USER:
      default:
        navigate("/");
        break;
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(prev => !prev);
    setError("");
    reset(); // Limpiar campos del formulario
  };

  const handleAuth = async (data: RegisterFormData) => {
    setLoading(true);
    setError("");

    try{
      if(isRegisterMode) {
        const registerData: RegisterDto = {
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
        }
        
        const result = await registerUser(registerData);

        if(result.success && result.data) {
          sessionStorage.setItem("user", JSON.stringify(result.data));

          redirectByRole(result.data.role);
        } else {
          setError(result.error || "Error al registrar el usuario");
        }
      } else {
        const loginData: LoginDto = {
          email: data.email,
          password: data.password,
        }

        const result = await login(loginData);

        if(result.success && result.data) {
          sessionStorage.setItem("user", JSON.stringify(result.data));

          redirectByRole(result.data.role);
        } else {
          setError(result.error || "Error al iniciar sesión");
        }
      }
    } catch (err: any) {
      console.error("Error al autenticar:", err);
      setError("Error inesperado. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-4 py-16 sm:py-28 bg-background">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 flex flex-col gap-6">
        {/* Título dinámico */}
        <h2 className="text-2xl font-bold text-center text-primary-text">
          {isRegisterMode ? "Registrarse" : "Iniciar sesión"}
        </h2>
        
        <form onSubmit={handleSubmit(handleAuth)} className="flex flex-col gap-4">
          {/* Campo NAME - Solo visible en modo registro */}
          {isRegisterMode && (
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="font-semibold text-sm text-primary-text">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                className="border rounded-lg py-2 px-3"
                placeholder="Juan Pérez"
                {...register("name", { 
                  required: isRegisterMode ? "Nombre obligatorio." : false 
                })}
                autoComplete="name"
              />
              {errors.name && (
                <span className="text-red-600 text-sm">{errors.name.message}</span>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold text-sm text-primary-text">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="border rounded-lg py-2 px-3"
              placeholder="ejemplo@correo.com"
              {...register("email", { 
                required: "El correo electrónico es obligatorio.",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido."
                }
              })}
              autoComplete="email"
            />
            {errors.email && (
              <span className="text-red-600 text-sm">{errors.email.message}</span>
            )}
          </div>

          {/* Campo PHONE - Solo visible en modo registro */}
          {isRegisterMode && (
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="font-semibold text-sm text-primary-text">
                Teléfono <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                className="border rounded-lg py-2 px-3"
                {...register("phone")}
                autoComplete="tel"
              />
              {errors.phone && (
                <span className="text-red-600 text-sm">{errors.phone.message}</span>
              )}
            </div>
          )}

          {/* Campo PASSWORD */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold text-sm text-primary-text">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="border rounded-lg py-2 px-3"
              {...register("password", {
                required: "Contraseña obligatoria.",
                minLength: {
                  value: 6,
                  message: "Mínimo 6 caracteres"
                }
              })}
              autoComplete={isRegisterMode ? "new-password" : "current-password"}
            />
            {errors.password && (
              <span className="text-red-600 text-sm">{errors.password.message}</span>
            )}
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            className="mt-2 bg-brand text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading 
              ? (isRegisterMode ? "Registrando..." : "Ingresando...") 
              : (isRegisterMode ? "Registrar" : "Ingresar")
            }
          </button>

          {/* Mensaje de error */}
          {error && (
            <div className="text-red-600 text-center text-sm mt-2 p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
        </form>
        
        {/* Botón para alternar modo */}
        <button 
          onClick={toggleMode}
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