import type { ReactNode } from "react";

export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  buttons?: ReactNode[];
}> = ({ title, subtitle, buttons }) => {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex flex-col">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-xs text-zinc-400 font-medium">{subtitle}</p>
      </div>

      {buttons?.length ? (
        <div className="flex items-center gap-3">
          {buttons.map((button, index) => (
            <div key={index}>{button}</div>
          ))}
        </div>
      ) : undefined}
    </div>
  );
};
