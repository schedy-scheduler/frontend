import { FormProvider, useForm } from "react-hook-form";
import { Modal } from "../Modal";
import { Input, InputMask } from "../form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
});

interface IFormData {
  name: string;
  email: string;
  phone: string;
}

interface IUpsertCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClick: (data: IFormData) => void;
}

export const UpsertCustomerModal: React.FC<IUpsertCustomerModalProps> = ({
  isOpen,
  onClose,
  onConfirmClick,
}) => {
  const form = useForm<IFormData>({
    values: {
      name: "",
      email: "",
      phone: "",
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    onConfirmClick(data);
  });

  return (
    <FormProvider {...form}>
      <Modal
        title="Novo cliente"
        description="Preencha as informações do cliente."
        isOpen={isOpen}
        onClose={onClose}
        confirmButtonText="Salvar"
        onConfirmButtonClick={handleSubmit}
      >
        <div className="flex flex-col gap-3">
          <Input name="name" label="Nome" placeholder="Nome do cliente" />
          <Input name="email" label="E-mail" placeholder="E-mail do cliente" />
          <Input
            name="phone"
            label="Telefone"
            placeholder="Telefone do cliente"
            mask={InputMask.PHONE}
          />
        </div>
      </Modal>
    </FormProvider>
  );
};
