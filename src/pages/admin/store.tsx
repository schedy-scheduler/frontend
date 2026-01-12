import { Input, InputWithPrefix } from "@/components/form";
import { PageHeader } from "@/components/PageHeader";
import { StoreHourItem } from "@/components/store/StoreHourItem";
import { Button } from "@/components/ui/button";
import { STORE_WEEK_DAYS } from "@/constants/store";
import { FormProvider, useForm } from "react-hook-form";

export const Store: React.FC = () => {
  const form = useForm({
    values: {
      name: "Stetes barber",
      email: "gstetes@gmail.com",
      phone: "(11) 99999-9999",
      slug: "stetes-barber",
      hours: {
        sunday: {
          active: false,
          start: "00:00",
          end: "00:00",
        },
        monday: {
          active: true,
          start: "09:00",
          end: "18:00",
        },
        tuesday: {
          active: true,
          start: "09:00",
          end: "18:00",
        },
        wednesday: {
          active: true,
          start: "09:00",
          end: "18:00",
        },
        thursday: {
          active: true,
          start: "09:00",
          end: "18:00",
        },
        friday: {
          active: true,
          start: "09:00",
          end: "18:00",
        },
        saturday: {
          active: false,
          start: "00:00",
          end: "00:00",
        },
      },
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <FormProvider {...form}>
      <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
        <PageHeader
          title="Meu estabelecimento"
          subtitle="Gerêncie seu estabelecimento."
        />

        <div className="w-full border p-3 rounded-lg flex flex-col gap-3">
          <strong className="font-semibold text-xs text-zinc-600">
            Dados do estabelecimento
          </strong>

          <div className="flex items-center gap-5 w-full">
            <div className="flex-1">
              <Input
                name="name"
                label="Nome"
                placeholder="Nome do estabelecimento"
              />
            </div>
            <div className="flex-1">
              <Input
                name="email"
                label="E-mail"
                placeholder="E-mail do estabelecimento"
              />
            </div>
          </div>

          <div className="flex items-center gap-5 w-full">
            <div className="flex-1">
              <Input
                name="phone"
                label="Telefone"
                placeholder="Telefone do estabelecimento"
              />
            </div>
            <div className="flex-1">
              <InputWithPrefix
                name="slug"
                label="Prefixo"
                placeholder="Defina qual vai ser o link para acessar seu calendário"
                prefix="https://calendario.com/"
              />
            </div>
          </div>
        </div>

        <div className="w-full border p-3 rounded-lg flex flex-col gap-3">
          <strong className="font-semibold text-xs text-zinc-600">
            Horário de funcionamento
          </strong>

          <div className="flex flex-col gap-2">
            {STORE_WEEK_DAYS?.map((day) => (
              <StoreHourItem
                key={day.value}
                name={`hours.${day.value}`}
                label={day.label}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </FormProvider>
  );
};
