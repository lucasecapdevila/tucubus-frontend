import { useState } from "react";

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl text-primary-text font-bold mb-2">TucuBus</h1>
        <p className="text-lg text-secondary-text">
          Encontrá tu colectivo al instante
        </p>
      </div>
      <form className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Día</label>
          <div className="flex flex-row justify-center">
            <label className="cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="day"
                value="Hábil"
                checked={day === "Hábil"}
                onChange={() => setDay("Hábil")}
              />{" "}
              <span className="block px-6 py-1.5 rounded-l-lg border-2 border-gray-300 bg-white text-gray-700 font-medium transition-all hover:border-blue-400 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-[#0c5392] peer-checked:text-white peer-checked:shadow-lg peer-checked:hover:bg-blue-600">
                Hábil
              </span>
            </label>
            <label className="cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="day"
                value="Sábado"
                checked={day === "Sábado"}
                onChange={() => setDay("Sábado")}
              />{" "}
              <span className="block px-6 py-1.5 border-2 border-gray-300 bg-white text-gray-700 font-medium transition-all hover:border-blue-400 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-[#0c5392] peer-checked:text-white peer-checked:shadow-lg peer-checked:hover:bg-blue-600">
                Sábado
              </span>
            </label>
            <label className="cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="day"
                value="Domingo"
                checked={day === "Domingo"}
                onChange={() => setDay("Domingo")}
              />{" "}
              <span className="block px-6 py-1.5 rounded-r-lg border-2 border-gray-300 bg-white text-gray-700 font-medium transition-all hover:border-blue-400 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-[#0c5392] peer-checked:text-white peer-checked:shadow-lg peer-checked:hover:bg-blue-600">
                Domingo
              </span>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="origin">
            Origen
          </label>
          <select
            id="origin"
            className="border rounded-lg py-2 px-3"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          >
            <option value="">Seleccione ciudad</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="destiny">
            Destino
          </label>
          <select
            id="destiny"
            className="border rounded-lg py-2 px-3"
            value={destiny}
            onChange={(e) => setDestiny(e.target.value)}
          >
            <option value="">Seleccione ciudad</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="option">
            Horario
          </label>
          <select
            id="option"
            className="border rounded-lg py-2 px-3"
            value={option}
            onChange={(e) => setOption(e.target.value)}
          >
            <option value="">Seleccione una opción</option>
            <option value="salir-ahora">Salir ahora</option>
            <option value="salir-a-la">Salir a la(s)</option>
            <option value="llegar-a-la">Llegar a la(s)</option>
            <option value="ultimo-disponible">Último disponible</option>
          </select>
        </div>
        {/* Aquí iría el botón de búsqueda o cualquier acción */}
        <button
          type="submit"
          className="mt-4 bg-brand text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};

export default Home;
