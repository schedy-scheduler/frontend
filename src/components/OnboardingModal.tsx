import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal } from "./Modal";
import { Input, InputMask, TimePicker } from "./form";
import { storeService } from "@/services/storeService";
import { storeHoursService } from "@/services/storeHoursService";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";

const onboardingSchema = yup
  .object({
    slug: yup
      .string()
      .required("URL do estabelecimento é obrigatória")
      .min(3, "URL deve ter no mínimo 3 caracteres")
      .max(50, "URL deve ter no máximo 50 caracteres")
      .matches(
        /^[a-z0-9-]+$/,
        "URL pode conter apenas letras minúsculas, números e hífen",
      ),
    email: yup.string().email("E-mail inválido").required(),
    phone: yup.string().required(),
    opening_hours: yup.string().required(),
    closing_hours: yup.string().required(),
  })
  .required();

interface IOnboardingModalProps {
  isOpen: boolean;
  storeId: string;
  onClose: () => void;
  onComplete: () => void;
}

interface OnboardingFormData {
  slug: string;
  email: string;
  phone: string;
  opening_hours: string;
  closing_hours: string;
}

export const OnboardingModal: React.FC<IOnboardingModalProps> = ({
  isOpen,
  storeId,
  onClose,
  onComplete,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [slugError, setSlugError] = useState<string>("");
  const { addToast } = useToast();
  const { user } = useAuth();

  const form = useForm<OnboardingFormData>({
    resolver: yupResolver(onboardingSchema),
    defaultValues: {
      slug: user?.store?.slug ?? "",
      email: "",
      phone: "",
      opening_hours: "09:00",
      closing_hours: "18:00",
    },
  });

  const handleSlugChange = async (slug: string) => {
    form.setValue("slug", slug);
    setSlugError("");

    if (!slug) return;

    // Validar formato
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return;
    }

    // Verificar se slug já existe
    const { data: exists } = await storeService.checkSlugExists(slug);
    if (exists) {
      setSlugError("Esta URL já está em uso");
    }
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    // Verificar se há erro no slug
    if (slugError) {
      addToast("Corrija os erros antes de continuar", "error");
      return;
    }

    setIsSaving(true);

    try {
      // Atualizar store com os dados do onboarding
      const updateData: Record<string, string | boolean> = {
        slug: data.slug || "",
        email: data.email || "",
        phone: data.phone || "",
        onboarding_completed: true,
      };

      const result = await storeService.update(storeId, updateData);

      if (result.error) {
        addToast("Erro ao salvar dados do estabelecimento", "error");
        setIsSaving(false);
        return;
      }

      // Criar horários de funcionamento para todos os dias da semana
      const openingTime = data.opening_hours || "09:00";
      const closingTime = data.closing_hours || "18:00";

      // Dias da semana: 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const storeHourData = {
          store_id: storeId,
          day_of_week: dayOfWeek,
          start_time: openingTime,
          end_time: closingTime,
          is_active: true,
        };

        // Verifica se já existe horário para este dia
        const existingHour = await storeHoursService.getByDay(
          storeId,
          dayOfWeek,
        );

        if (existingHour.error || !existingHour.data) {
          // Criar novo horário
          await storeHoursService.create(storeHourData);
        } else {
          // Atualizar horário existente
          await storeHoursService.update(existingHour.data.id, {
            start_time: openingTime,
            end_time: closingTime,
            is_active: true,
          });
        }
      }

      addToast("Dados do estabelecimento salvos com sucesso!", "success");
      setIsSaving(false);
      onComplete();
    } catch (error) {
      console.error(error);
      addToast("Erro ao salvar dados", "error");
      setIsSaving(false);
    }
  });

  useEffect(() => {
    if (user) {
      form.setValue("email", user.email || "");
      form.setValue("phone", user.phone || "");
      form.setValue("slug", user.store?.slug || "");
    }
  }, [user, form]);

  return (
    <FormProvider {...form}>
      <Modal
        title="Bem-vindo!"
        description="Vamos configurar seu estabelecimento para começar."
        isOpen={isOpen}
        onClose={onClose}
        confirmButtonText={isSaving ? "Salvando..." : "Concluir"}
        onConfirmButtonClick={handleSubmit}
        cancelButtonText="Configurar depois"
      >
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium">
              URL do Estabelecimento
            </label>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <span className="text-xs sm:text-sm text-zinc-500">
                agendamentos.com/
              </span>
              <input
                type="text"
                value={form.watch("slug") || ""}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="seu-estabelecimento"
                className="flex-1 min-w-[120px] px-2 sm:px-3 py-1.5 sm:py-2 border border-zinc-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950"
              />
            </div>
            {slugError && <p className="text-xs text-red-500">{slugError}</p>}
            {form.formState.errors.slug && (
              <p className="text-xs text-red-500">
                {form.formState.errors.slug.message}
              </p>
            )}
          </div>

          <Input
            name="email"
            label="E-mail do Estabelecimento"
            placeholder="Digite o e-mail"
            type="email"
          />

          <Input
            name="phone"
            label="Telefone"
            placeholder="Digite o telefone"
            mask={InputMask.PHONE}
          />

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <TimePicker name="opening_hours" label="Horário de Abertura" />
            </div>
            <div className="flex-1">
              <TimePicker name="closing_hours" label="Horário de Fechamento" />
            </div>
          </div>

          <p className="text-xs text-zinc-500">
            Você pode editar essas informações posteriormente nas configurações
            do estabelecimento.
          </p>
        </div>
      </Modal>
    </FormProvider>
  );
};
