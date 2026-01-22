import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal } from "./Modal";
import { Input, TimePicker } from "./form";
import { storeService } from "@/services/storeService";
import { useToast } from "@/hooks/useToast";

const onboardingSchema = yup.object({
  slug: yup
    .string()
    .required("URL do estabelecimento é obrigatória")
    .min(3, "URL deve ter no mínimo 3 caracteres")
    .max(50, "URL deve ter no máximo 50 caracteres")
    .matches(
      /^[a-z0-9-]+$/,
      "URL pode conter apenas letras minúsculas, números e hífen",
    ),
  email: yup.string().email("E-mail inválido"),
  phone: yup.string(),
  opening_hours: yup.string(),
  closing_hours: yup.string(),
});

interface IOnboardingModalProps {
  isOpen: boolean;
  storeId: string;
  onClose: () => void;
  onComplete: () => void;
}

interface OnboardingFormData {
  slug?: string;
  email?: string;
  phone?: string;
  opening_hours?: string;
  closing_hours?: string;
}

export const OnboardingModal: React.FC<IOnboardingModalProps> = ({
  isOpen,
  storeId,
  onClose,
  onComplete,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [slugError, setSlugError] = useState<string>("");
  const { addToast } = useToast();

  const form = useForm<OnboardingFormData>({
    resolver: yupResolver(onboardingSchema),
    defaultValues: {
      slug: "",
      email: "",
      phone: "",
      opening_hours: "09:00",
      closing_hours: "18:00",
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      addToast("Selecione uma imagem válida", "error");
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast("A imagem deve ter no máximo 5MB", "error");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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

    setIsUploading(true);

    try {
      let imageUrl = "";

      // Upload da imagem se selecionada
      if (selectedFile) {
        const uploadResult = await storeService.uploadStoreImage(
          storeId,
          selectedFile,
        );

        if (uploadResult.error) {
          addToast("Erro ao fazer upload da imagem", "error");
          setIsUploading(false);
          return;
        }

        imageUrl = uploadResult.data || "";
      }

      // Atualizar store com os dados do onboarding
      const updateData: Record<string, string | boolean> = {
        slug: data.slug || "",
        email: data.email || "",
        phone: data.phone || "",
        opening_hours: data.opening_hours || "09:00",
        closing_hours: data.closing_hours || "18:00",
      };

      if (imageUrl) {
        updateData.image_url = imageUrl;
      }

      const result = await storeService.update(storeId, updateData);

      if (result.error) {
        addToast("Erro ao salvar dados do estabelecimento", "error");
        setIsUploading(false);
        return;
      }

      addToast("Dados do estabelecimento salvos com sucesso!", "success");
      setIsUploading(false);
      onComplete();
    } catch (error) {
      addToast("Erro ao salvar dados", "error");
      setIsUploading(false);
    }
  });

  return (
    <FormProvider {...form}>
      <Modal
        title="Bem-vindo!"
        description="Vamos configurar seu estabelecimento para começar."
        isOpen={isOpen}
        onClose={onClose}
        confirmButtonText={isUploading ? "Salvando..." : "Concluir"}
        onConfirmButtonClick={handleSubmit}
        cancelButtonText="Configurar depois"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              URL do Estabelecimento
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-500">agendamentos.com/</span>
              <input
                type="text"
                value={form.watch("slug") || ""}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="seu-estabelecimento"
                className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950"
              />
            </div>
            {slugError && <p className="text-xs text-red-500">{slugError}</p>}
            {form.formState.errors.slug && (
              <p className="text-xs text-red-500">
                {form.formState.errors.slug.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Foto do Estabelecimento
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full p-6 border-2 border-dashed border-zinc-300 rounded-lg cursor-pointer hover:border-zinc-400 transition"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-zinc-500">
                      Clique para selecionar uma imagem
                    </p>
                  </div>
                )}
              </label>
            </div>
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
          />

          <div className="flex gap-4">
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
