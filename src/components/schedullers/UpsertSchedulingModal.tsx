import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal } from "../Modal";
import { Input, TimePicker, Select, MultiSelect } from "../form";
import { customersService } from "@/services/customersService";
import { employeesService } from "@/services/employeesService";
import { servicesService } from "@/services/servicesService";
import { schedulesService } from "@/services/schedulesService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { translateError } from "@/lib/errorTranslation";

interface IFormData {
  professional: string;
  date: string;
  time: string;
  customer: string;
  services: string[];
  total?: number;
  duration?: string;
}

interface Service extends SelectOption {
  value?: number;
  duration?: string;
}

interface IUpsertSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClick: (data: IFormData) => void;
  selectedDate?: Date;
  storeId: string | null;
  selectedSchedule?: any;
  onDelete?: () => void;
}

interface SelectOption {
  id: string | number;
  name: string;
  label?: string;
}

const schedulingValidationSchema = yup
  .object({
    customer: yup.string().required("Cliente é obrigatório"),
    professional: yup.string().required("Profissional é obrigatório"),
    date: yup.string().required("Data é obrigatória"),
    time: yup.string().required("Hora é obrigatória"),
    services: yup
      .array(yup.string())
      .min(1, "Selecione pelo menos um serviço")
      .required("Selecione pelo menos um serviço"),
    total: yup.number().optional().notRequired(),
    duration: yup.string().optional().notRequired(),
  })
  .required();

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getDateFromSelectedDate = (date?: Date) => {
  if (!date) return getTodayDate();
  return date.toISOString().split("T")[0];
};

const getTimeFromSelectedDate = (date?: Date) => {
  if (!date) return getCurrentTime();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const convertDurationToMinutes = (duration: string): number => {
  // Format expected: "HH:mm" or "Hmm" (e.g., "01:30" or "1h 30m")
  const timeRegex = /(\d+)\D*:?\D*(\d+)?/;
  const match = duration.match(timeRegex);

  if (!match) return 0;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;

  return hours * 60 + minutes;
};

const formatDateToBR = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

export const UpsertSchedulingModal: React.FC<IUpsertSchedulingModalProps> = ({
  isOpen,
  onClose,
  onConfirmClick,
  selectedDate,
  storeId,
  selectedSchedule,
  onDelete,
}) => {
  const [customers, setCustomers] = useState<SelectOption[]>([]);
  const [professionals, setProfessionals] = useState<SelectOption[]>([]);
  const [servicesWithData, setServicesWithData] = useState<Service[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<string>("00:00");
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteConfirmDrawerOpen, setDeleteConfirmDrawerOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scheduledDateForCompletion, setScheduledDateForCompletion] =
    useState<string>("");
  const { addToast } = useToast();

  const form = useForm<IFormData>({
    resolver: yupResolver(schedulingValidationSchema) as any,
    defaultValues: {
      professional: "",
      customer: "",
      date: getDateFromSelectedDate(selectedDate),
      time: getTimeFromSelectedDate(selectedDate),
      services: [],
      total: 0,
      duration: "00:00",
    },
  });

  const calculateTotals = (serviceIds: string[]) => {
    const selectedServices = servicesWithData.filter((s) =>
      serviceIds.includes(String(s.id)),
    );

    let total = 0;
    let totalMinutes = 0;

    selectedServices.forEach((service) => {
      total += service.value || 0;
      totalMinutes += convertDurationToMinutes(service.duration || "00:00");
    });

    // Convert total minutes back to HH:mm format
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const durationStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    setTotalValue(total);
    setTotalDuration(durationStr);

    // Update form values
    form.setValue("total", total);
    form.setValue("duration", durationStr);
  };

  const handleServicesChange = (selectedIds: string[]) => {
    form.setValue("services", selectedIds);
    calculateTotals(selectedIds);
  };

  const loadModalData = async () => {
    try {
      console.log("loadModalData called with storeId:", storeId);

      if (!storeId) {
        console.warn("Store ID não definido");
        return;
      }

      const [customersResult, professionalsResult, servicesResult] =
        await Promise.all([
          customersService.getAll(storeId),
          employeesService.getAll(storeId),
          servicesService.getAll(storeId),
        ]);

      console.log("Customers Result:", customersResult);
      console.log("Professionals Result:", professionalsResult);
      console.log("Services Result:", servicesResult);

      if (customersResult.data) {
        console.log("Setting customers:", customersResult.data);
        setCustomers(
          customersResult.data.map((customer) => ({
            id: customer.id,
            name: customer.name,
          })),
        );
      } else if (customersResult.error) {
        console.error("Customers error:", customersResult.error);
      }

      if (professionalsResult.data) {
        console.log("Setting professionals:", professionalsResult.data);
        setProfessionals(
          professionalsResult.data.map((employee) => ({
            id: employee.id,
            name: employee.name,
          })),
        );
      } else if (professionalsResult.error) {
        console.error("Professionals error:", professionalsResult.error);
      }

      if (servicesResult.data) {
        console.log("Setting services:", servicesResult.data);
        const servicesWithDataMap = servicesResult.data.map(
          (service: Service) => ({
            id: service.id,
            name: service.name,
            value: service.value,
            duration: service.duration,
          }),
        );
        setServicesWithData(servicesWithDataMap);
      } else if (servicesResult.error) {
        console.error("Services error:", servicesResult.error);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do modal:", error);
    }
  };

  useEffect(() => {
    if (!isOpen || !storeId) {
      return;
    }

    loadModalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, storeId]);

  useEffect(() => {
    if (selectedSchedule && isOpen && servicesWithData.length > 0) {
      setIsEditMode(true);
      // Preencher o formulário com dados do agendamento selecionado
      const scheduleDate = selectedSchedule.start
        ? new Date(selectedSchedule.start).toISOString().split("T")[0]
        : "";
      const scheduleTime = selectedSchedule.start
        ? new Date(selectedSchedule.start)
            .toISOString()
            .split("T")[1]
            .substring(0, 5)
        : "";

      // Usar IDs dos serviços que já vêm no evento
      const serviceIds = selectedSchedule.data?.serviceIds || [];

      // Verificar se o agendamento já foi concluído
      const isScheduleCompleted =
        selectedSchedule.rawSchedule?.completed || false;
      setIsCompleted(isScheduleCompleted);
      setScheduledDateForCompletion(scheduleDate);

      form.reset({
        customer: selectedSchedule.data?.customerId || "",
        professional: selectedSchedule.data?.professionalId || "",
        date: scheduleDate,
        time: scheduleTime,
        services: serviceIds.map(String),
        total: 0,
        duration: "00:00",
      });

      if (serviceIds.length > 0) {
        calculateTotals(serviceIds.map(String));
      }
    } else if (!selectedSchedule && isOpen) {
      setIsEditMode(false);
      form.reset({
        professional: "",
        customer: "",
        date: getDateFromSelectedDate(selectedDate),
        time: getTimeFromSelectedDate(selectedDate),
        services: [],
        total: 0,
        duration: "00:00",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchedule, isOpen, servicesWithData.length]);

  const handleSubmit = form.handleSubmit((data) => {
    console.log("Form data before submit:", data);
    onConfirmClick(data);
    form.reset();
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleDeleteClick = async () => {
    if (!selectedSchedule?.id) return;

    setIsDeleting(true);
    const { error } = await schedulesService.delete(selectedSchedule.id);

    if (error) {
      addToast("Erro ao deletar agendamento", "error");
      setIsDeleting(false);
    } else {
      addToast("Agendamento deletado com sucesso", "success");
      setDeleteConfirmDrawerOpen(false);
      setIsDeleting(false);
      // Reset states and close modal
      form.reset();
      onClose();
      // Trigger refresh
      onDelete?.();
    }
  };

  const canCompleteSchedule = () => {
    if (!scheduledDateForCompletion) return false;
    const today = new Date().toISOString().split("T")[0];
    return today >= scheduledDateForCompletion;
  };

  const handleCompleteSchedule = async () => {
    if (!selectedSchedule?.id || !canCompleteSchedule()) return;

    setIsCompleting(true);
    const { error } = await schedulesService.update(selectedSchedule.id, {});

    if (error) {
      console.error("Erro ao marcar como concluído:", error);
      addToast(
        `Erro ao marcar agendamento como concluído: ${translateError(error)}`,
        "error",
      );
      setIsCompleting(false);
    } else {
      addToast("Agendamento marcado como concluído", "success");
      setIsCompleted(true);
      setIsCompleting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <Modal
        title={isEditMode ? "Detalhes do agendamento" : "Novo agendamento"}
        description={
          isEditMode
            ? "Visualize e edite as informações do agendamento."
            : "Preencha as informações do agendamento."
        }
        isOpen={isOpen}
        onClose={handleClose}
        confirmButtonText={isEditMode ? "Salvar alterações" : "Agendar"}
        onConfirmButtonClick={handleSubmit}
        deleteButtonText={isEditMode ? "Deletar" : undefined}
        onDeleteButtonClick={() => setDeleteConfirmDrawerOpen(true)}
      >
        <div className="flex flex-col gap-4">
          <Select
            name="customer"
            label="Cliente"
            placeholder="Selecione um cliente"
            options={customers || []}
          />

          <Select
            name="professional"
            label="Profissional"
            placeholder="Selecione um profissional"
            options={professionals || []}
          />

          <Input
            name="date"
            label="Data"
            placeholder="Selecione a data"
            type="date"
          />

          <TimePicker name="time" label="Hora" />

          <MultiSelect
            name="services"
            label="Serviços"
            placeholder="Selecione um ou mais serviços"
            options={servicesWithData || []}
            onChange={handleServicesChange}
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Valor Total</label>
              <div className="mt-2 p-2 bg-zinc-100 rounded">
                R$ {totalValue.toFixed(2)}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Duração Total</label>
              <div className="mt-2 p-2 bg-zinc-100 rounded">
                {totalDuration}
              </div>
            </div>
          </div>

          {isEditMode && (
            <div className="mt-4 pt-4 border-t">
              <Button
                type="button"
                variant={isCompleted ? "secondary" : "default"}
                onClick={handleCompleteSchedule}
                disabled={!canCompleteSchedule() || isCompleting || isCompleted}
                className="w-full"
              >
                {isCompleting
                  ? "Marcando como concluído..."
                  : isCompleted
                    ? "✓ Agendamento concluído"
                    : "Marcar como concluído"}
              </Button>
              {!canCompleteSchedule() && (
                <p className="text-xs text-zinc-500 mt-2">
                  Você poderá marcar como concluído a partir de{" "}
                  {formatDateToBR(scheduledDateForCompletion)}
                </p>
              )}
            </div>
          )}
        </div>
      </Modal>

      <Dialog
        open={deleteConfirmDrawerOpen}
        onOpenChange={setDeleteConfirmDrawerOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar este agendamento? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmDrawerOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? "Deletando..." : "Deletar agendamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
