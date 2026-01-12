import { PageHeader } from "@/components/PageHeader";
import { Calendar } from "@/components/schedullers/Calendar";

export const Home: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-5 h-[94vh]">
      <PageHeader
        title="Meus agendamentos"
        subtitle="Gerêncie seus agendamentos aqui."
      />

      <Calendar />
    </div>
  );
};
