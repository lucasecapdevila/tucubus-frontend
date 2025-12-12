import { useState } from "react";
import { Divider, Button, Form, Input } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const { TextArea } = Input;

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<ContactFormData>();

  // Función simulada para manejar el envío del formulario
  const onFinish = () => {
    setLoading(true);

    // Simulación de envío
    setTimeout(() => {
      toast.success("¡Mensaje enviado con éxito! Te responderemos pronto.");
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
      <div className="contact-container bg-white p-6 sm:p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-[#0c5392] text-center mt-0 mb-4">
          Conversemos!
        </h2>
        <p className="text-lg text-gray-600 text-center mb-8">
          Si tenés alguna duda, sugerencia o querés reportar un problema, usá el
          formulario o contactanos por otros medios.
        </p>

        <Divider orientation="left">Envíanos un Mensaje</Divider>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="space-y-4"
            >
              <Form.Item
                name="name"
                label="Tu Nombre"
                rules={[
                  { required: true, message: "Por favor ingresa tu nombre" },
                ]}
              >
                <Input placeholder="Ej: Juan Pérez" size="large" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Tu Email"
                rules={[
                  { required: true, message: "Por favor ingresa tu email" },
                  {
                    type: "email",
                    message: "El formato de email no es válido",
                  },
                ]}
              >
                <Input placeholder="ejemplo@correo.com" size="large" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Tu Mensaje"
                rules={[
                  { required: true, message: "Por favor escribe tu mensaje" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Escribe aquí tu consulta o sugerencia..."
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                  style={{ backgroundColor: "#0c5392" }}
                >
                  Enviar Mensaje
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="lg:w-1/2 lg:pl-6 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              Otras formas de contacto
            </h3>

            <ul className="space-y-4">
              {/* Email */}
              <li className="flex items-start gap-3">
                <MailOutlined className="text-blue-600 text-2xl mt-1 shrink-0" />
                <div>
                  <span className="font-semibold text-gray-800">
                    Correo Electrónico
                  </span>
                  <p className="text-gray-600">
                    Envíanos un mail directo a: <br />
                    <Link
                      to="mailto:lcapdevila60@gmail.com"
                      className="text-[#0c5392] hover:underline font-medium"
                    >
                      lcapdevila60@gmail.com
                    </Link>
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <PhoneOutlined className="text-[#0c5392] text-2xl mt-1 shrink-0" />
                <div>
                  <span className="font-semibold text-gray-800">WhatsApp</span>
                  <p className="text-gray-600">
                    Escríbenos por WhatsApp: <br />
                    <Link
                      to="https://wa.me/5493865244215"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0c5392] hover:underline font-medium"
                    >
                      +54 9 3865 244215
                    </Link>
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <SolutionOutlined className="text-blue-600 text-2xl mt-1 shrink-0" />
                <div>
                  <span className="font-semibold text-gray-800">
                    Redes Sociales / GitHub
                  </span>
                  <p className="text-gray-600">
                    Si eres desarrollador, puedes encontrar el repositorio en{" "}
                    <Link
                      to="https://github.com/lucasecapdevila/tucubus-frontend"
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" hover:underline font-medium"
                    >
                      GitHub
                    </Link>
                    .
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
