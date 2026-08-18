import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes } from "react";

export interface InputParams extends InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder?: string;
  inputStyle?: string;
  icon?: LucideIcon;
  value?: string | number;
}
const Input = ({
  type = "text",
  inputStyle = "",
  className = "",
  icon: Icon,
  placeholder,
  value,
  disabled,
  onChange,
  ...props
}: InputParams) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <Icon
          size={18}
          className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-400"
        />
      )}

      <input
        {...props}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-full rounded-full border border-gray-300 bg-white py-3 ${
          Icon ? "pl-13" : "pl-4"
        } pr-4 outline-none focus:border-blue-500 ${inputStyle} ${className}`}
      />
    </div>
  );
};

export default Input;
