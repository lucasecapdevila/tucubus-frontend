import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCrud } from "../../hooks/useCrud";
import { Button, Form, Select, Radio, TimePicker } from "antd";
import { FadeLoader } from "react-spinners";
import dayjs from "dayjs";
import ResultadosHorarios from "../home/ResultadosHorarios";
import toast from "react-hot-toast";
import { SearchData, SearchFormData } from "@/types";
import { Stop } from "@/types/models/models.types";
import api from "@/services/api";

const Home: React.FC = () => {
  const [day, setDay] = useState("Hábil");
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loadingStops, setLoadingStops] = useState(true);

  useEffect(() => {
    cargarParadas();
  }, []);

  const cargarParadas = async () => {
    try {
      setLoadingStops(true);
      const response = await api.get<Stop[]>("/stops");

      const paradasActivas = response.data
        .filter((stop) => stop.isActive)
        .sort((a, b) => a.name.localeCompare(b.name));

      setStops(paradasActivas);
    } catch (error) {
      console.error("Error al cargar paradas:", error);
      toast.error("Error al cargar las paradas disponibles");
    } finally {
      setLoadingStops(false);
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

      {loadingStops ? (
        <div className="w-full flex justify-center items-center py-12">
          <FadeLoader color="#0c5392" loading={loadingStops} />
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
                    placeholder="Seleccione parada"
                    options={stops.map((stop) => ({
                      label: stop.name,
                      value: stop.id,
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
                    placeholder="Seleccione parada"
                    options={stops.map((stop) => ({
                      label: stop.name,
                      value: stop.id,
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
