import { DataTable } from "@/components/Datatable";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { UpsertEmployeeModal } from "@/components/employees/UpsertEmployeeModal";

export type TService = {
  id: string;
  name: string;
  email: string;
  function: string;
};

export const Employees: React.FC = () => {
  const [employeeModalIsOpen, setEmployeeModalIsOpen] = useState(false);

  const columns: ColumnDef<TService>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "E-mail",
    },
    {
      accessorKey: "function",
      header: "Função",
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
        title="Meus profissionais"
        subtitle="Gerêncie seus profissionais aqui."
        buttons={[
          <Button onClick={() => setEmployeeModalIsOpen(true)}>
            <Plus />
            Novo profissional
          </Button>,
        ]}
      />

      <DataTable
        columns={columns}
        data={[
          {
            id: "1",
            name: "Guilherme Stetes",
            email: "gstetes@gmail.com",
            function: "Barbeiro",
          },
          {
            id: "2",
            name: "Guilherme Phelipe",
            email: "gphelipe@gmail.com",
            function: "Atendente",
          },
        ]}
      />

      <UpsertEmployeeModal
        isOpen={employeeModalIsOpen}
        onClose={() => setEmployeeModalIsOpen(false)}
        onConfirmClick={(data) => console.log(data)}
      />
    </div>
  );
};
