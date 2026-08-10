import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
  Icon?: LucideIcon;
  handleClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  type = "button",
  className = "",
  children,
  Icon,
  handleClick,
  onClick,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      onClick={handleClick || onClick}
      type={type}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;
