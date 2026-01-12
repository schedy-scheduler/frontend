import { DataTable } from "@/components/Datatable";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { UpsertServiceModal } from "@/components/services/UpsertServiceModal";
import { useState } from "react";

export type TService = {
  id: string;
  name: string;
  duration: string;
  value: number;
};

export const Services: React.FC = () => {
  const [serviceModalIsOpen, setServiceModalIsOpen] = useState(false);

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
        const user = row.original;

        return (
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => console.log(user)}>
              <Pencil />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => console.log(user)}>
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
          <Button onClick={() => setServiceModalIsOpen(true)}>
            <Plus />
            Novo serviço
          </Button>,
        ]}
      />

      <DataTable
        columns={columns}
        data={[
          {
            id: "1",
            name: "Corte de cabelo",
            value: 29.9,
            duration: "30min",
          },
          {
            id: "2",
            name: "Corte de cabelo + Barba",
            value: 59.9,
            duration: "1h",
          },
        ]}
      />

      <UpsertServiceModal
        isOpen={serviceModalIsOpen}
        onClose={() => setServiceModalIsOpen(false)}
        onConfirmClick={(data) => console.log(data)}
      />
    </div>
  );
};
