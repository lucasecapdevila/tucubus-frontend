import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCrud } from "../../hooks/useCrud";
import { Button, Form, Select, Radio, TimePicker, Alert } from "antd";
import dayjs from "dayjs";

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
  const [searchDone, setSearchDone] = useState(false);

  // Métodos CRUD
  const { getAll } = useCrud('horarios');

  useEffect(() => {
    mostrarLineas();
  }, []);

  const mostrarLineas = async () => {
    try {
      const lineas = await getAll();
      console.log(lineas);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      origin: "",
      destiny: "",
      option: "",
      time: null,
    },
  });

  const option = watch("option");

  const onSubmit = (data) => {
    // Aquí puedes procesar los datos, incluyendo 'day' que se maneja por estado separado
    console.log({ ...data, day }); // Ejemplo: combina con day
    setSearchDone(true);
  };

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
        className="bg-white shadow-md rounded-lg w-full max-w-xs sm:max-w-md mx-auto p-3 sm:p-6 flex flex-col gap-2 min-w-0"
      >
        <Form.Item label="Día" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
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
          rules={{ required: 'El origen es obligatorio' }}
          render={({ field }) => (
            <Form.Item
              label="Origen"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              validateStatus={errors.origin ? 'error' : ''}
              help={errors.origin?.message}
            >
              <Select
                {...field}
                placeholder="Seleccione ciudad"
                options={cities.map((city) => ({ label: city, value: city }))}
              />
            </Form.Item>
          )}
        />

        <Controller
          name="destiny"
          control={control}
          rules={{
            required: 'El destino es obligatorio',
            validate: (value) =>
              value !== watch("origin") || 'El destino debe ser distinto al origen',
          }}
          render={({ field }) => (
            <Form.Item
              label="Destino"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              validateStatus={errors.destiny ? 'error' : ''}
              help={errors.destiny?.message}
            >
              <Select
                {...field}
                placeholder="Seleccione ciudad"
                options={cities.map((city) => ({ label: city, value: city }))}
              />
            </Form.Item>
          )}
        />

        <Controller
          name="option"
          control={control}
          rules={{ required: 'Seleccione una opción de horario' }}
          render={({ field }) => (
            <Form.Item
              label="Horario"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              validateStatus={errors.option ? 'error' : ''}
              help={errors.option?.message}
            >
              <Select
                {...field}
                placeholder="Seleccione una opción"
                options={[
                  { label: "Salir ahora", value: "salir-ahora" },
                  { label: "Salir a la(s)", value: "salir-a-la" },
                  { label: "Llegar a la(s)", value: "llegar-a-la" },
                  { label: "Último disponible", value: "ultimo-disponible" },
                ]}
              />
            </Form.Item>
          )}
        />

        {(option === "salir-a-la" || option === "llegar-a-la") && (
          <Controller
            name="time"
            control={control}
            rules={{ required: 'Debe seleccionar un horario' }}
            render={({ field }) => (
              <Form.Item
                label="Selecciona el horario"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                validateStatus={errors.time ? 'error' : ''}
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
      {searchDone && (
        <Alert
          message="Búsqueda realizada"
          type="success"
          showIcon
          className="mt-4"
        />
      )}
    </div>
  );
};

export default Home;