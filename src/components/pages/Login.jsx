import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    const result = await login({ username: data.username, userpassword: data.password });
    setLoading(false);
    if (result.success) {
      sessionStorage.setItem("usuarioTucuBus", JSON.stringify(result.data));
      if (result.data.role === "Administrador") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError(result.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-background">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-primary-text">Iniciar sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              {...register("password", { required: "Contraseña requerida" })}
              autoComplete="current-password"
            />
            {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
          </div>
          <button
            type="submit"
            className="mt-2 bg-brand text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          {error && <span className="text-red-600 text-center text-sm mt-2">{error}</span>}
        </form>
      </div>
    </div>
  );
}

export default Login