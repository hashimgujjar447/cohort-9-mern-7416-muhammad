import type { LucideIcon } from "lucide-react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  className?: string;
  children: React.ReactNode;
  Icon?: LucideIcon;
  handleClick?: () => void;
};

const Button = ({
  type = "button",
  className,
  children,
  Icon,
  handleClick,
}: ButtonProps) => {
  return (
    <button
      onClick={handleClick}
      type={type}
      className={`flex items-center justify-center gap-2  px-4 py-2 ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;
