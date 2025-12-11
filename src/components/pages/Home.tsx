import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCrud } from "../../hooks/useCrud";
import { Button, Form, Select, Radio, TimePicker } from "antd";
import { FadeLoader } from "react-spinners";
import dayjs from "dayjs";
import ResultadosHorarios from "../home/ResultadosHorarios";
import toast from "react-hot-toast";
import { Recorrido, SearchFormData } from "@/types";

interface SearchData extends SearchFormData {
  day: string;
}

const Home: React.FC = () => {
  const [day, setDay] = useState("Hábil");
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [loadingCiudades, setLoadingCiudades] = useState(true);

  // Métodos CRUD
  const { getAll } = useCrud<Recorrido>("recorridos");

  useEffect(() => {
    cargarCiudades();
  }, []);

  const cargarCiudades = async () => {
    try {
      setLoadingCiudades(true);
      const recorridos = await getAll();

      // Extraer ciudades únicas de orígenes y destinos
      const ciudadesSet = new Set<string>();
      recorridos.forEach((recorrido) => {
        if (recorrido.origen) ciudadesSet.add(recorrido.origen);
        if (recorrido.destino) ciudadesSet.add(recorrido.destino);
      });

      // Convertir Set a array y ordenar alfabéticamente
      const ciudadesArray = Array.from(ciudadesSet).sort();
      setCiudades(ciudadesArray);
    } catch (error) {
      console.error("Error al cargar ciudades:", error);
      toast.error("Error al cargar las ciudades disponibles");
    } finally {
      setLoadingCiudades(false);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SearchFormData>({
    defaultValues: {
      origin: "",
      destiny: "",
      option: "",
      time: undefined,
    },
  });

  const option = watch("option");

  const onSubmit = (data: SearchFormData) => {
    if (data.option === "llegar-a-la" || data.option === "ultimo-disponible") {
      toast.error(
        `La búsqueda por '${
          data.option === "llegar-a-la"
            ? "hora de llegada"
            : "último disponible"
        }' aún no está implementada.`
      );
      setSearchData(null); // Evita que ResultadosHorarios intente buscar
      return;
    }

    setSearchData({ ...data, day });
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-10 flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl text-primary-text font-bold mb-2">TucuBus</h1>
        <p className="text-lg text-secondary-text">
          Encontrá tu colectivo al instante
        </p>
      </div>

      {loadingCiudades ? (
        <div className="w-full flex justify-center items-center py-12">
          <FadeLoader color="#0c5392" loading={loadingCiudades} />
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-md rounded-lg w-full max-w-xs sm:max-w-md mx-auto p-3 sm:p-6 flex flex-col gap-2 min-w-0"
          >
            <Form.Item
              label="Día"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Radio.Group
                value={day}
                onChange={(e) => setDay(e.target.value)}
                buttonStyle="solid"
                className="w-full"
              >
                <Radio.Button value="Hábil" className="w-1/3 text-center">
                  Hábil
                </Radio.Button>
                <Radio.Button value="Sábado" className="w-1/3 text-center">
                  Sábado
                </Radio.Button>
                <Radio.Button value="Domingo" className="w-1/3 text-center">
                  Domingo
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Controller
              name="origin"
              control={control}
              rules={{ required: "El origen es obligatorio" }}
              render={({ field }) => (
                <Form.Item
                  label="Origen"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  validateStatus={errors.origin ? "error" : ""}
                  help={errors.origin?.message}
                >
                  <Select
                    {...field}
                    placeholder="Seleccione ciudad"
                    options={ciudades.map((city) => ({
                      label: city,
                      value: city,
                    }))}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="destiny"
              control={control}
              rules={{
                required: "El destino es obligatorio",
                validate: (value) =>
                  value !== watch("origin") ||
                  "El destino debe ser distinto al origen",
              }}
              render={({ field }) => (
                <Form.Item
                  label="Destino"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  validateStatus={errors.destiny ? "error" : ""}
                  help={errors.destiny?.message}
                >
                  <Select
                    {...field}
                    placeholder="Seleccione ciudad"
                    options={ciudades.map((city) => ({
                      label: city,
                      value: city,
                    }))}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="option"
              control={control}
              rules={{ required: "Seleccione una opción de horario" }}
              render={({ field }) => (
                <Form.Item
                  label="Horario"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  validateStatus={errors.option ? "error" : ""}
                  help={errors.option?.message}
                >
                  <Select
                    {...field}
                    placeholder="Seleccione una opción"
                    options={[
                      { label: "Salir ahora", value: "salir-ahora" },
                      { label: "Salir a la(s)", value: "salir-a-la" },
                      { label: "Llegar a la(s)", value: "llegar-a-la" },
                      {
                        label: "Último disponible",
                        value: "ultimo-disponible",
                      },
                    ]}
                  />
                </Form.Item>
              )}
            />

            {(option === "salir-a-la" || option === "llegar-a-la") && (
              <Controller
                name="time"
                control={control}
                rules={{ required: "Debe seleccionar un horario" }}
                render={({ field }) => (
                  <Form.Item
                    label="Selecciona el horario"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    validateStatus={errors.time ? "error" : ""}
                    help={errors.time?.message}
                  >
                    <TimePicker
                      {...field}
                      format="HH:mm"
                      className="w-full"
                      value={field.value ? dayjs(field.value, "HH:mm") : null}
                      onChange={(time) => {
                        field.onChange(time ? time.format("HH:mm") : null);
                      }}
                      placeholder="Seleccione hora (HH:mm)"
                      showNow={false}
                    />
                  </Form.Item>
                )}
              />
            )}

            <Button
              type="primary"
              htmlType="submit"
              className="mt-4 w-full bg-brand"
              style={{ backgroundColor: "#0c5392" }}
            >
              Buscar
            </Button>
          </form>

          {searchData && <ResultadosHorarios searchData={searchData} />}
        </>
      )}
    </div>
  );
};

export default Home;
