import { DataTable } from "@/components/Datatable";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { UpsertCustomerModal } from "@/components/customers/UpsertCustomerModal";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export const Customers: React.FC = () => {
  const [customerModalIsOpen, setCustomerModalIsOpen] = useState(false);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Telefone",
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
        title="Meus clientes"
        subtitle="Gerêncie seus clientes aqui."
        buttons={[
          <Button onClick={() => setCustomerModalIsOpen(true)}>
            <Plus />
            Novo cliente
          </Button>,
        ]}
      />

      <DataTable
        columns={columns}
        data={[
          {
            id: "1",
            name: "João Silva",
            email: "gstetes@gmail.com",
            phone: "(11) 98765-4321",
          },
          {
            id: "2",
            name: "Guilherme Souza",
            email: "guilherme.souza@example.com",
            phone: "(11) 98765-4321",
          },
        ]}
      />

      <UpsertCustomerModal
        isOpen={customerModalIsOpen}
        onClose={() => setCustomerModalIsOpen(false)}
        onConfirmClick={(data) => console.log(data)}
      />
    </div>
  );
};
