import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCrud } from "../../hooks/useCrud";

const cities = [
  "Buenos Aires",
  "Córdoba",
  "Rosario",
  "Mendoza",
  "La Plata",
  "San Miguel de Tucumán",
  "Mar del Plata",
  "Salta",
];

const Home = () => {
  const [day, setDay] = useState("Hábil");
  const [origin, setOrigin] = useState("");
  const [destiny, setDestiny] = useState("");
  const [option, setOption] = useState("");
  const [searchDone, setSearchDone] = useState(false);
  const [time, setTime] = useState("");

  // Métodos CRUD
  const { getAll } = useCrud('horarios')

  useEffect(() => {
    mostrarLineas();
  }, []);

  const mostrarLineas = async() => {
    try{
      const lineas = await getAll()
      console.log(lineas);
      
    } 
    catch(error){
      console.log(error)
    }
  }
  

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  // Necesita sincronizar selects controlados + react-hook-form
  const handleOriginChange = (e) => {
    setOrigin(e.target.value);
    setValue('origin', e.target.value);
  };

  const handleDestinyChange = (e) => {
    setDestiny(e.target.value);
    setValue('destiny', e.target.value);
  };

  const handleOptionChange = (e) => {
    setOption(e.target.value);
    setValue('option', e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    setValue('time', e.target.value);
  };

  const onSubmit = () => {
    setSearchDone(true);
  };

  // Reset el estado de búsqueda cada vez que cambia algo
  // (opcional, para ocultar resultado si el usuario modifica campos)
  // useEffect(() => setSearchDone(false), [origin, destiny, option, day]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-10 flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl text-primary-text font-bold mb-2">TucuBus</h1>
        <p className="text-lg text-secondary-text">
          Encontrá tu colectivo al instante
        </p>
      </div>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white shadow-md rounded-lg w-full max-w-xs sm:max-w-md mx-auto p-3 sm:p-6 flex flex-col gap-6"
        style={{minWidth:'0'}}
      >
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Día</label>
          <div className="flex flex-row flex-wrap justify-center">
            {/* Día sigue controlado por useState */}
            <label className="cursor-pointer flex-1 min-w-[90px]">
              <input
                className="peer sr-only"
                type="radio"
                name="day"
                value="Hábil"
                checked={day === "Hábil"}
                onChange={() => setDay("Hábil")}
              />
              <span className="block w-full text-center px-2 sm:px-6 py-1.5 rounded-l-lg border-2 border-gray-300 bg-white text-gray-700 font-medium transition-all hover:border-blue-400 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-[#0c5392] peer-checked:text-white peer-checked:shadow-lg peer-checked:hover:bg-blue-600">
                Hábil
              </span>
            </label>
            <label className="cursor-pointer flex-1 min-w-[90px]">
              <input
                className="peer sr-only"
                type="radio"
                name="day"
                value="Sábado"
                checked={day === "Sábado"}
                onChange={() => setDay("Sábado")}
              />
              <span className="block w-full text-center px-2 sm:px-6 py-1.5 border-2 border-gray-300 bg-white text-gray-700 font-medium transition-all hover:border-blue-400 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-[#0c5392] peer-checked:text-white peer-checked:shadow-lg peer-checked:hover:bg-blue-600">
                Sábado
              </span>
            </label>
            <label className="cursor-pointer flex-1 min-w-[90px]">
              <input
                className="peer sr-only"
                type="radio"
                name="day"
                value="Domingo"
                checked={day === "Domingo"}
                onChange={() => setDay("Domingo")}
              />
              <span className="block w-full text-center px-2 sm:px-6 sm:pl-3 py-1.5 rounded-r-lg border-2 border-gray-300 bg-white text-gray-700 font-medium transition-all hover:border-blue-400 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-[#0c5392] peer-checked:text-white peer-checked:shadow-lg peer-checked:hover:bg-blue-600">
                Domingo
              </span>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="origin">Origen</label>
          <select
            id="origin"
            className="border rounded-lg py-2 px-3 w-full"
            value={origin}
            {...register('origin', { required: 'El origen es obligatorio' })}
            onChange={handleOriginChange}
          >
            <option value="">Seleccione ciudad</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.origin && <span className="text-red-600 text-sm">{errors.origin.message}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="destiny">Destino</label>
          <select
            id="destiny"
            className="border rounded-lg py-2 px-3 w-full"
            value={destiny}
            {...register('destiny', {
              required: 'El destino es obligatorio',
              validate: value => value !== origin || 'El destino debe ser distinto al origen'
            })}
            onChange={handleDestinyChange}
          >
            <option value="">Seleccione ciudad</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.destiny && <span className="text-red-600 text-sm">{errors.destiny.message}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="option">Horario</label>
          <select
            id="option"
            className="border rounded-lg py-2 px-3 w-full"
            value={option}
            {...register('option', { required: 'Seleccione una opción de horario' })}
            onChange={handleOptionChange}
          >
            <option value="">Seleccione una opción</option>
            <option value="salir-ahora">Salir ahora</option>
            <option value="salir-a-la">Salir a la(s)</option>
            <option value="llegar-a-la">Llegar a la(s)</option>
            <option value="ultimo-disponible">Último disponible</option>
          </select>
          {errors.option && <span className="text-red-600 text-sm">{errors.option.message}</span>}
        </div>
        {(option === "salir-a-la" || option === "llegar-a-la") && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="time">Selecciona el horario</label>
            <input
              id="time"
              type="time"
              className="border rounded-lg py-2 px-3 w-full"
              value={time}
              {...register('time', {
                required: 'Debe seleccionar un horario',
              })}
              onChange={handleTimeChange}
            />
            {errors.time && <span className="text-red-600 text-sm">{errors.time.message}</span>}
          </div>
        )}
        <button
          type="submit"
          className="mt-4 bg-brand text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Buscar
        </button>
      </form>
      {searchDone && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
          Búsqueda realizada
        </div>
      )}
    </div>
  );
};

export default Home;
