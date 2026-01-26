import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

interface StoreImageUploadProps {
  storeId: string;
  currentImageUrl?: string;
  onImageUpload?: (url: string) => void;
}

export const StoreImageUpload: React.FC<StoreImageUploadProps> = ({
  storeId,
  currentImageUrl,
  onImageUpload,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null,
  );
  const { setValue } = useFormContext();
  const toast = useToast();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.addToast(
        "Por favor, selecione um arquivo de imagem válido",
        "error",
      );
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.addToast("A imagem não pode exceder 5MB", "error");
      return;
    }

    setIsUploading(true);

    try {
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Generate file path
      const timestamp = Date.now();
      const fileExt = file.name.split(".").pop();
      const fileName = `${storeId}/image-${timestamp}.${fileExt}`;

      // Delete old image if exists
      if (currentImageUrl) {
        try {
          const oldFileName = currentImageUrl.split("/").pop();
          if (oldFileName) {
            await supabase.storage
              .from("stores")
              .remove([`${storeId}/${oldFileName}`]);
          }
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Upload new image
      const { error: uploadError, data } = await supabase.storage
        .from("stores")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("stores")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Update form
      setValue("image_url", publicUrl);
      onImageUpload?.(publicUrl);

      toast.addToast("Imagem enviada com sucesso!", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.addToast("Erro ao enviar imagem", "error");
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl && !previewUrl) return;

    setIsUploading(true);

    try {
      const urlToDelete = currentImageUrl || previewUrl;
      if (urlToDelete) {
        const fileName = urlToDelete.split("/").pop();
        if (fileName) {
          await supabase.storage
            .from("stores")
            .remove([`${storeId}/${fileName}`]);
        }
      }

      setPreviewUrl(null);
      setValue("image_url", "");
      toast.addToast("Imagem removida com sucesso!", "success");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.addToast("Erro ao remover imagem", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="font-semibold text-xs sm:text-sm text-zinc-600">
        Logo/Imagem do estabelecimento
      </label>

      <div className="relative">
        {previewUrl ? (
          <div className="relative w-full h-48 sm:h-56 bg-zinc-100 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Store preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="w-full h-48 sm:h-56 border-2 border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition">
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload size={32} className="text-zinc-400" />
              <div className="text-sm text-zinc-600">
                <p className="font-medium">Clique para enviar uma imagem</p>
                <p className="text-xs text-zinc-500">PNG, JPG até 5MB</p>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {isUploading && (
        <p className="text-xs text-zinc-500">Enviando imagem...</p>
      )}
    </div>
  );
};
