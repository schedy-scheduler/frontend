import { FormProvider, useForm } from "react-hook-form";
import { Modal } from "../Modal";
import { Input, InputMask } from "../form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  value: yup.number().required("Valor é obrigatório"),
  duration: yup.string().required("Duração é obrigatório"),
});

interface IFormData {
  name: string;
  value: number;
  duration: string;
}

interface IUpsertServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClick: (data: IFormData) => void;
}

export const UpsertServiceModal: React.FC<IUpsertServiceModalProps> = ({
  isOpen,
  onClose,
  onConfirmClick,
}) => {
  const form = useForm<IFormData>({
    values: {
      name: "",
      value: 0,
      duration: "00:00",
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    onConfirmClick(data);
  });

  return (
    <FormProvider {...form}>
      <Modal
        title="Novo serviço"
        description="Preencha as informações do serviço."
        isOpen={isOpen}
        onClose={onClose}
        confirmButtonText="Salvar"
        onConfirmButtonClick={handleSubmit}
      >
        <div className="flex flex-col gap-3">
          <Input name="name" label="Nome" placeholder="Nome do serviço" />
          <Input
            name="value"
            label="Valor"
            placeholder="Valor do serviço"
            mask={InputMask.CURRENCY}
          />
          <Input
            name="duration"
            label="Duração"
            placeholder="Duração do serviço"
            type="time"
          />
        </div>
      </Modal>
    </FormProvider>
  );
};
