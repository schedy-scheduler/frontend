import { DataTable } from "@/components/Datatable";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { UpsertServiceModal } from "@/components/services/UpsertServiceModal";
import { useState, useEffect } from "react";
import { servicesService } from "@/services/servicesService";
import { storeService } from "@/services/storeService";
import { authService } from "@/services/authService";

export type TService = {
  id: string;
  name: string;
  duration: string;
  value: number;
};

export const Services: React.FC = () => {
  const [serviceModalIsOpen, setServiceModalIsOpen] = useState(false);
  const [services, setServices] = useState<TService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storeId, setStoreId] = useState<string>("");
  const [editingId, setEditingId] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userResult = await authService.getCurrentUser();
    if (userResult.data?.id) {
      const storeResult = await storeService.getByOwnerId(userResult.data.id);
      if (storeResult.data?.id) {
        setStoreId(storeResult.data.id);
        loadServices(storeResult.data.id);
      }
    }
  };

  const loadServices = async (storeId: string) => {
    setIsLoading(true);
    const result = await servicesService.getAll(storeId);
    if (result.data) {
      setServices(result.data as TService[]);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este serviço?")) {
      await servicesService.delete(id);
      loadServices(storeId);
    }
  };

  const handleEdit = (service: TService) => {
    setEditingId(service.id);
    setServiceModalIsOpen(true);
  };

  const handleAddNew = () => {
    setEditingId("");
    setServiceModalIsOpen(true);
  };

  const handleConfirm = async (data: any) => {
    if (editingId) {
      await servicesService.update(editingId, data);
    } else {
      await servicesService.create({
        ...data,
        store_id: storeId,
      });
    }
    setServiceModalIsOpen(false);
    loadServices(storeId);
  };

  const columns: ColumnDef<TService>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "value",
      header: "Valor",
    },
    {
      accessorKey: "duration",
      header: "Duração",
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const service = row.original;

        return (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(service)}
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(service.id)}
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeader
        title="Meus serviços"
        subtitle="Gerêncie seus serviços aqui."
        buttons={[
          <Button onClick={handleAddNew}>
            <Plus />
            Novo serviço
          </Button>,
        ]}
      />

      {isLoading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : (
        <DataTable columns={columns} data={services} />
      )}

      <UpsertServiceModal
        isOpen={serviceModalIsOpen}
        onClose={() => setServiceModalIsOpen(false)}
        onConfirmClick={handleConfirm}
      />
    </div>
  );
};
