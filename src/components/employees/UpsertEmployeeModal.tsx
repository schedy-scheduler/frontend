import { FormProvider, useForm } from "react-hook-form";
import { Modal } from "../Modal";
import { Input } from "../form";
import { CommissionFields } from "./CommissionFields";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().required("E-mail é obrigatório").email("E-mail inválido"),
  function: yup.string().required("Função é obrigatório"),
  commission_type: yup
    .string()
    .required("Tipo de comissionamento é obrigatório"),
  commission_value: yup
    .number()
    .typeError("Valor é obrigatório")
    .when("commission_type", {
      is: "full",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) =>
        schema
          .required("Valor é obrigatório")
          .min(0, "Valor não pode ser negativo"),
    }),
});

interface IFormData {
  name: string;
  email: string;
  function: string;
  commission_type?: string;
  commission_value?: number;
}

interface IUpsertEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClick: (data: IFormData) => void;
  employee?: IFormData;
}

export const UpsertEmployeeModal: React.FC<IUpsertEmployeeModalProps> = ({
  isOpen,
  onClose,
  onConfirmClick,
  employee,
}) => {
  const form = useForm<IFormData>({
    values: {
      name: employee?.name || "",
      email: employee?.email || "",
      function: employee?.function || "",
      commission_type: employee?.commission_type || "percentage",
      commission_value: employee?.commission_value || 0,
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    onConfirmClick(data);
  });

  return (
    <FormProvider {...form}>
      <Modal
        title={employee ? "Editar profissional" : "Novo profissional"}
        description={
          employee
            ? "Atualize as informações do profissional."
            : "Preencha as informações do profissional."
        }
        isOpen={isOpen}
        onClose={onClose}
        confirmButtonText="Salvar"
        onConfirmButtonClick={handleSubmit}
      >
        <div className="flex flex-col gap-3">
          <Input name="name" label="Nome" placeholder="Nome do profissional" />
          <Input
            name="email"
            label="E-mail"
            placeholder="E-mail do profissional"
          />
          <Input
            name="function"
            label="Função"
            placeholder="Função do profissional"
          />

          <div className="border-t pt-3 mt-3">
            <CommissionFields
              commissionType={employee?.commission_type}
              commissionValue={employee?.commission_value}
            />
          </div>
        </div>
      </Modal>
    </FormProvider>
  );
};
