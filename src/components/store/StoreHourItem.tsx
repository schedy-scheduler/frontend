import { useFormContext } from "react-hook-form";
import { Switch, TimePicker } from "../form";

interface IStoreHourItemProps {
  name: string;
  label: string;
}

export const StoreHourItem: React.FC<IStoreHourItemProps> = ({
  name,
  label,
}) => {
  const { watch } = useFormContext();

  const isActive = watch(`${name}.active`);

  return (
    <div className="flex items-center gap-2">
      <Switch name={`${name}.active`} />
      <label
        htmlFor={`${name}.active`}
        className="text-xs text-zinc-500 w-25 font-medium"
      >
        {label}
      </label>
      <TimePicker name={`${name}.start`} disabled={!isActive} />
      <TimePicker name={`${name}.end`} disabled={!isActive} />
    </div>
  );
};
