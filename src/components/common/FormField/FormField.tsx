import { Controller } from 'react-hook-form';
import { Input, Select, Switch, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { FormFieldProps } from '@/types';
import TextArea from 'antd/es/input/TextArea';

const FormField: React.FC<FormFieldProps> = ({ field, control }) => {
  const renderField = (inputField: any) => {
    switch (field.type) {
      case 'select':
        return (
          <Select
            className="w-full"
            value={inputField.value !== undefined ? inputField.value : null}
            onChange={inputField.onChange}
            options={field.options || []}
            placeholder={field.placeholder || `Seleccione ${field.label.toLowerCase()}`}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        );

      case 'multiselect':
        return (
          <Select
            mode="multiple"
            className="w-full"
            value={inputField.value || []}
            onChange={inputField.onChange}
            options={field.options || []}
            placeholder={field.placeholder || `Seleccione ${field.label.toLowerCase()}`}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        );

      case 'switch':
        return (
          <Switch
            checked={!!inputField.value}
            onChange={(val) => inputField.onChange(val)}
          />
        );

      case 'time':
        return (
          <TimePicker
            format="HH:mm"
            className="w-full"
            value={inputField.value ? dayjs(inputField.value, "HH:mm") : null}
            onChange={(time) => {
              if (time) {
                const formatted = time.format("HH:mm");
                inputField.onChange(formatted);
              } else {
                inputField.onChange(null);
              }
            }}
            placeholder={field.placeholder || "Seleccione hora (HH:mm)"}
            showNow={false}
          />
        );

      case 'number':
        return (
          <Input
            {...inputField}
            type="number"
            className="w-full"
            placeholder={field.placeholder}
          />
        );

      case 'email':
        return (
          <Input
            {...inputField}
            type="email"
            className="w-full"
            placeholder={field.placeholder || "ejemplo@correo.com"}
          />
        );

      case 'textarea':
        return (
          <TextArea
            {...inputField}
            className="w-full"
            placeholder={field.placeholder}
            rows={4}
          />
        );

      default:
        // type: 'text' o undefined
        return (
          <Input
            {...inputField}
            className="w-full"
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="mb-2">
      <label className="block mb-1 font-semibold text-primary-text">
        {field.label}
        {field.rules?.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        name={field.name}
        control={control}
        rules={field.rules}
        render={({ field: inputField }) => renderField(inputField)}
      />
    </div>
  );
};

export default FormField;
