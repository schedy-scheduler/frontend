import { FormProvider, useForm } from "react-hook-form";
import { Modal } from "../Modal";
import { Input } from "../form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().required("E-mail é obrigatório").email("E-mail inválido"),
  function: yup.string().required("Função é obrigatório"),
});

interface IFormData {
  name: string;
  email: string;
  function: string;
}

interface IUpsertEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClick: (data: IFormData) => void;
}

export const UpsertEmployeeModal: React.FC<IUpsertEmployeeModalProps> = ({
  isOpen,
  onClose,
  onConfirmClick,
}) => {
  const form = useForm<IFormData>({
    values: {
      name: "",
      email: "",
      function: "",
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    onConfirmClick(data);
  });

  return (
    <FormProvider {...form}>
      <Modal
        title="Novo profissional"
        description="Preencha as informações do profissional."
        isOpen={isOpen}
        onClose={onClose}
        confirmButtonText="Salvar"
        onConfirmButtonClick={handleSubmit}
      >
        <div className="flex flex-col gap-3">
          <Input name="name" label="Nome" placeholder="Nome do serviço" />
          <Input name="email" label="E-mail" placeholder="E-mail do serviço" />
          <Input
            name="function"
            label="Funcão"
            placeholder="Funcão do serviço"
          />
        </div>
      </Modal>
    </FormProvider>
  );
};
