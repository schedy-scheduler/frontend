import { useFormContext } from "react-hook-form";
import { Select } from "@/components/form/select";
import { Input } from "@/components/form/input";

interface CommissionFieldsProps {
  commissionType?: string;
  commissionValue?: number;
}

export const CommissionFields: React.FC<CommissionFieldsProps> = ({
  commissionType = "percentage",
}) => {
  const { watch } = useFormContext();
  const selectedType = watch("commission_type") || commissionType;

  const commissionTypeOptions = [
    { id: "full", name: "Valor total do serviço (100%)" },
    { id: "percentage", name: "Porcentagem (%)" },
    { id: "fixed", name: "Valor fixo (R$)" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Select
        name="commission_type"
        label="Tipo de comissionamento"
        placeholder="Selecione o tipo"
        options={commissionTypeOptions}
      />

      {selectedType !== "full" && (
        <Input
          name="commission_value"
          label={
            selectedType === "percentage"
              ? "Porcentagem (%)"
              : "Valor fixo (R$)"
          }
          placeholder={selectedType === "percentage" ? "Ex: 50" : "Ex: 30.00"}
          type="number"
          step={selectedType === "percentage" ? "1" : "0.01"}
          min="0"
          max={selectedType === "percentage" ? "100" : undefined}
        />
      )}

      <div className="text-xs text-zinc-600 bg-blue-50 p-2 rounded">
        {selectedType === "full" && (
          <p>
            O profissional receberá 100% do valor total do(s) serviço(s)
            agendado(s).
          </p>
        )}
        {selectedType === "percentage" && (
          <p>
            O profissional receberá a porcentagem informada do valor total do
            agendamento.
          </p>
        )}
        {selectedType === "fixed" && (
          <p>
            O profissional receberá o valor fixo informado por cada agendamento
            com ele.
          </p>
        )}
      </div>
    </div>
  );
};
