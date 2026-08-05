import type { LucideIcon } from "lucide-react";
import type { ChangeEvent } from "react";

type InputParams = {
  type?: string;
  placeholder: string;
  style?: string;
  icon?: LucideIcon;
  value: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({
  type = "text",
  style,
  icon: Icon,
  placeholder,
  value,
  onChange,
}: InputParams) => {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={18}
          className="absolute top-1/2 left-6 -translate-y-1/2 text-gray-400"
        />
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-full border bg-white border-gray-300 py-3 ${
          Icon ? "pl-14" : "pl-3"
        } pr-3 outline-none focus:border-blue-500 ${style}`}
      />
    </div>
  );
};

export default Input;
