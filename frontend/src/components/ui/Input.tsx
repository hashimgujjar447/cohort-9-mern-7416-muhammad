import type { LucideIcon } from "lucide-react";

type InputParams = {
  type?: string;
  placeholder: string;
  style?: string;
  icon?: LucideIcon;
};

const Input = ({
  type = "text",
  style,
  icon: Icon,
  placeholder,
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
        className={`w-full rounded-full border bg-white border-gray-300 py-3 ${
          Icon ? "pl-14" : "pl-3"
        } pr-3 outline-none focus:border-blue-500 ${style}`}
      />
    </div>
  );
};

export default Input;
