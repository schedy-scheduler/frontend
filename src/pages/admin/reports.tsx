import { PageHeader } from "@/components/PageHeader";
import { ChartSpline } from "lucide-react";

export const Reports: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeader
        title="Relatórios"
        subtitle="Em breve, seus relatórios estarão disponíveis aqui."
      />

      <div className="w-full h-[calc(100vh-164px)] flex items-center justify-center flex-col gap-3">
        <div className="w-12 h-12 rounded-lg bg-zinc-200 text-zinc-700 flex items-center justify-center">
          <ChartSpline />
        </div>

        <div className="flex flex-col gap-1 items-center">
          <strong className="text-lg font-semibold text-zinc-700">
            Relatórios
          </strong>
          <span className="text-center max-w-[60%] text-sm font-medium text-zinc-400">
            Em breve, nessa página você poderá visualizar relatórios sobre seus
            agendamentos, serviços e profissionais mais detalhados.
          </span>
        </div>
      </div>
    </div>
  );
};
