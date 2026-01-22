import { DataTable } from "@/components/Datatable";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { UpsertEmployeeModal } from "@/components/employees/UpsertEmployeeModal";
import { employeesService } from "@/services/employeesService";
import { storeService } from "@/services/storeService";
import { authService } from "@/services/authService";

export type TEmployee = {
  id: string;
  name: string;
  email: string;
  function: string;
};

export const Employees: React.FC = () => {
  const [employeeModalIsOpen, setEmployeeModalIsOpen] = useState(false);
  const [employees, setEmployees] = useState<TEmployee[]>([]);
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
        loadEmployees(storeResult.data.id);
      }
    }
  };

  const loadEmployees = async (storeId: string) => {
    setIsLoading(true);
    const result = await employeesService.getAll(storeId);
    if (result.data) {
      setEmployees(result.data as TEmployee[]);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este profissional?")) {
      await employeesService.delete(id);
      loadEmployees(storeId);
    }
  };

  const handleEdit = (employee: TEmployee) => {
    setEditingId(employee.id);
    setEmployeeModalIsOpen(true);
  };

  const handleAddNew = () => {
    setEditingId("");
    setEmployeeModalIsOpen(true);
  };

  const handleConfirm = async (data: any) => {
    if (editingId) {
      await employeesService.update(editingId, data);
    } else {
      await employeesService.create({
        ...data,
        store_id: storeId,
      });
    }
    setEmployeeModalIsOpen(false);
    loadEmployees(storeId);
  };

  const columns: ColumnDef<TEmployee>[] = [
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
        const employee = row.original;

        return (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(employee)}
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(employee.id)}
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
        title="Meus profissionais"
        subtitle="Gerêncie seus profissionais aqui."
        buttons={[
          <Button onClick={handleAddNew}>
            <Plus />
            Novo profissional
          </Button>,
        ]}
      />

      {isLoading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : (
        <DataTable columns={columns} data={employees} />
      )}

      <UpsertEmployeeModal
        isOpen={employeeModalIsOpen}
        onClose={() => setEmployeeModalIsOpen(false)}
        onConfirmClick={handleConfirm}
      />
    </div>
  );
};
