import { Controller } from 'react-hook-form';
import { Input, Select, Switch, TimePicker } from 'antd';
import dayjs from 'dayjs';

const FormField = ({ field, control }) => {
  const renderField = (inputField) => {
    switch (field.type) {
      case 'select':
        return (
          <Select
            className="w-full"
            value={inputField.value !== undefined ? inputField.value : null}
            onChange={inputField.onChange}
            options={field.options || []}
            placeholder={`Seleccione ${field.label.toLowerCase()}`}
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
            placeholder="Seleccione hora (HH:mm)"
            showNow={false}
          />
        );

      default:
        return <Input {...inputField} className="w-full" />;
    }
  };

  return (
    <div className="mb-2">
      <label className="block mb-1 font-semibold text-primary-text">
        {field.label}
        {field.rules?.required && (
          <span className="text-red-500 ml-1">*</span>
        )}
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