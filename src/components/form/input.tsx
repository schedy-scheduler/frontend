import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { Input as InputComponent } from "../ui/input";
import { useMemo } from "react";
import { InputMask } from "./input.types";
import type { MaskType } from "./input.types";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label?: string;
  mask?: MaskType;
}

// Remove todos os caracteres não numéricos
const unmask = (value: string): string => {
  return value.replace(/\D/g, "");
};

// Aplica a máscara baseada no tipo
const applyMask = (value: string, mask?: MaskType): string => {
  if (!mask || !value) return value;

  const numbers = unmask(value);

  switch (mask) {
    case InputMask.PHONE: {
      // (00) 00000-0000 ou (00) 0000-0000
      if (numbers.length <= 10) {
        return numbers
          .replace(/^(\d{2})/, "($1) ")
          .replace(/(\d{4})(\d)/, "$1-$2")
          .trim();
      }
      return numbers
        .replace(/^(\d{2})/, "($1) ")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .substring(0, 15)
        .trim();
    }
    case InputMask.CPF: {
      // 000.000.000-00
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .substring(0, 14);
    }
    case InputMask.CNPJ: {
      // 00.000.000/0000-00
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
        .substring(0, 18);
    }
    case InputMask.CEP: {
      // 00000-000
      return numbers.replace(/(\d{5})(\d)/, "$1-$2").substring(0, 9);
    }
    case InputMask.CURRENCY: {
      // R$ 0,00
      if (!numbers) return "";
      const cents = parseInt(numbers, 10);
      const formatted = (cents / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `R$ ${formatted}`;
    }
    case InputMask.DATE: {
      // 00/00/0000
      return numbers
        .replace(/(\d{2})(\d)/, "$1/$2")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .substring(0, 10);
    }
    default: {
      // Máscara customizada: # = número, A = letra, * = qualquer
      let result = "";
      let valueIndex = 0;
      for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
        const maskChar = mask[i];
        if (maskChar === "#") {
          // Apenas números
          while (valueIndex < value.length && !/\d/.test(value[valueIndex])) {
            valueIndex++;
          }
          if (valueIndex < value.length) {
            result += value[valueIndex];
            valueIndex++;
          }
        } else if (maskChar === "A") {
          // Apenas letras
          while (
            valueIndex < value.length &&
            !/[a-zA-Z]/.test(value[valueIndex])
          ) {
            valueIndex++;
          }
          if (valueIndex < value.length) {
            result += value[valueIndex];
            valueIndex++;
          }
        } else if (maskChar === "*") {
          // Qualquer caractere
          result += value[valueIndex];
          valueIndex++;
        } else {
          // Caractere fixo da máscara
          result += maskChar;
        }
      }
      return result;
    }
  }
};

export const Input: React.FC<IInputProps> = ({
  name,
  label,
  mask,
  onChange,
  value,
  ...props
}) => {
  const { control } = useFormContext();

  // Valor com máscara para exibição (componente sem react-hook-form)
  const displayValue = useMemo(() => {
    if (value !== undefined) {
      return applyMask(String(value), mask);
    }
    return "";
  }, [value, mask]);

  const handleUncontrolledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const rawValue = unmask(inputValue);

    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: rawValue,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  // Componente sem react-hook-form (sem name)
  if (!name) {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <Label className="text-xs sm:text-sm">{label}</Label>}
        <InputComponent
          {...props}
          value={mask ? displayValue : value}
          onChange={mask ? handleUncontrolledChange : onChange}
          className="text-sm"
        />
      </div>
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const maskedValue = applyMask(field.value || "", mask);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          const rawValue = mask ? unmask(inputValue) : inputValue;
          field.onChange(rawValue);
        };

        return (
          <div className="flex flex-col gap-1 w-full">
            {label && (
              <Label htmlFor={name} className="text-xs sm:text-sm">
                {label}
              </Label>
            )}
            <InputComponent
              id={name}
              {...props}
              ref={field.ref}
              name={field.name}
              value={mask ? maskedValue : field.value}
              onChange={handleChange}
              onBlur={field.onBlur}
              className="text-sm"
            />
            {error && <p className="text-xs text-red-500">{error.message}</p>}
          </div>
        );
      }}
    />
  );
};
