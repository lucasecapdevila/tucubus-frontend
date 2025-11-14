import { Divider, Button } from "antd";
import { Link } from "react-router-dom";

const Help = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
      <div className="help-container bg-white p-6 sm:p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-[#0c5392] text-center mt-0 mb-8">
          ¡Hola! ¿Necesitas una mano?
        </h2>

        <div className="mb-8">
          <h3 className="text-2xl text-gray-700 flex items-center gap-2 font-semibold">
            ¿Qué es <strong className="font-extrabold">TucuBus</strong>?
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed mt-2">
            Bienvenido! <strong className="font-extrabold">TucuBus</strong> es
            tu amigo digital para encontrar los horarios de colectivos de forma
            rápida y fácil. Olvídate de buscar en mil lugares o de esperar sin
            saber. Aquí te mostramos las opciones de viaje disponibles para que
            planees tu día sin estrés.
          </p>
        </div>

        <Divider />

        <div className="mb-8">
          <h3 className="text-2xl text-gray-700 flex items-center gap-2 font-semibold">
            Encontrá tu colectivo en 3 pasos
          </h3>

          <ol className="space-y-4 list-decimal list-inside pl-4 text-lg text-gray-700 mt-4">
            <li className="font-semibold">
              Elegí el día:
              <p className="ml-6 mt-1 text-gray-600 font-normal">
                Seleccioná si vas a viajar un día{" "}
                <strong className="font-bold">Hábil</strong>, un{" "}
                <strong className="font-bold">Sábado</strong> o un{" "}
                <strong className="font-bold">Domingo/Feriado</strong>. ¡Los
                horarios cambian!
              </p>
            </li>

            <li className="font-semibold">
              Decinos dónde vas:
              <p className="ml-6 mt-1 text-gray-600 font-normal">
                Usá los menús desplegables para indicar tu{" "}
                <strong className="font-bold">Origen</strong> (donde subís) y tu{" "}
                <strong className="font-bold">Destino</strong> (donde bajás).
                Asegurate de que sean diferentes!
              </p>
            </li>

            <li className="font-semibold">
              Definí el horario:
              <p className="ml-6 mt-1 text-gray-600 font-normal">
                Elegí la opción que mejor te sirva:{" "}
                <strong className="font-bold">"Salir ahora"</strong> o{" "}
                <strong className="font-bold">"Salir a la(s)"</strong> (y poné
                la hora exacta). Presioná{" "}
                <strong className="font-bold">Buscar</strong> y ¡listo! Te
                mostraremos todas las opciones, incluyendo los viajes directos y
                los que requieren una conexión.
              </p>
            </li>
          </ol>
        </div>

        <Divider />

        <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="text-xl text-yellow-800 flex items-center gap-2 font-semibold">
            ¡Ojo! Una aclaración importante sobre el Ingreso
          </h4>
          <p className="text-lg text-yellow-700 leading-relaxed mt-2">
            El botón de <strong className="font-bold">"Ingresar"</strong> (o{" "}
            <strong className="font-bold">Login</strong>) te permite registrarte
            y loguearte como usuario, ¡lo cual es genial!
          </p>
          <p className="text-lg text-yellow-700 leading-relaxed mt-2 border-l-4 border-yellow-400 pl-3">
            Aviso Importante: Actualmente, si ingresas como usuario común, la
            funcionalidad de la página es exactamente la misma que si estuvieras
            navegando sin loguearte. Es decir, aún no hay funciones exclusivas
            para usuarios registrados, más allá de la posibilidad de iniciar y
            cerrar sesión.
          </p>
          <p className="text-lg text-yellow-700 leading-relaxed mt-2">
            Si sos administrador, el sistema te redirigirá a la sección de{" "}
            <strong className="font-bold">Admin</strong>, donde podrás
            actualizar la información de los colectivos.
          </p>
        </div>

        <Divider />

        <div className="text-center">
          <h3 className="text-2xl text-gray-700 font-semibold">
            ¿Tenés alguna duda o sugerencia?
          </h3>
          <p className="text-lg text-gray-600 mt-2">
            Si querés comunicarte con nosotros, ¡es muy fácil! Dirigite a la
            página de Contacto. ¡Te esperamos!
          </p>
          <Link to="/contacto">
            <Button
              type="primary"
              size="large"
              className="mt-4 w-full sm:w-auto transition-colors"
              style={{ backgroundColor: "#0c5392" }}
            >
              Ir a la página de Contacto
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;
