import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IMultiSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: Array<{ id: string | number; name: string; label?: string }>;
  onChange?: (values: string[]) => void;
}

export const MultiSelect: React.FC<IMultiSelectProps> = ({
  name,
  label,
  placeholder = "Selecione...",
  options,
  onChange,
}) => {
  const { control } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const selectedValues = field.value || [];
        const selectedOptions = options.filter((opt) =>
          selectedValues.includes(String(opt.id)),
        );

        return (
          <div className="flex flex-col gap-1">
            {label && <Label>{label}</Label>}
            <div className="relative" ref={containerRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  isOpen && "border-ring ring-1 ring-ring",
                )}
              >
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.length > 0 ? (
                    selectedOptions.map((opt) => (
                      <div
                        key={opt.id}
                        className="flex items-center gap-1 rounded bg-secondary px-2 py-1 text-xs font-medium"
                      >
                        <span>{opt.label || opt.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newValues = selectedValues.filter(
                              (v: string) => v !== String(opt.id),
                            );
                            field.onChange(newValues);
                            onChange?.(newValues);
                          }}
                          className="hover:text-destructive"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-muted-foreground">{placeholder}</span>
                  )}
                </div>
                <ChevronDownIcon
                  className={cn(
                    "size-4 opacity-50 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              {isOpen && (
                <div className="absolute top-full z-[9999] mt-1 w-full rounded-md border border-input bg-popover p-1 shadow-md">
                  {options.map((option) => {
                    const isSelected = selectedValues.includes(
                      String(option.id),
                    );
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            const newValues = selectedValues.filter(
                              (v: string) => v !== String(option.id),
                            );
                            field.onChange(newValues);
                            onChange?.(newValues);
                          } else {
                            const newValues = [
                              ...selectedValues,
                              String(option.id),
                            ];
                            field.onChange(newValues);
                            onChange?.(newValues);
                          }
                        }}
                        className={cn(
                          "w-full rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent",
                          isSelected &&
                            "bg-accent font-medium text-accent-foreground",
                        )}
                      >
                        {option.label || option.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {error && <p className="text-xs text-red-500">{error.message}</p>}
          </div>
        );
      }}
    />
  );
};
