import type { ReactNode } from "react";

interface EditorToggleButtonProps {
  icon: ReactNode;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}

const EditorToggleButton = ({
  icon,
  isActive = false,
  onClick,
  disabled = false,
  title,
}: EditorToggleButtonProps) => {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`
        flex h-9 w-9 items-center justify-center rounded-lg border
        transition-all duration-200 ease-in-out
        ${
          isActive
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
        }
        disabled:cursor-not-allowed
        disabled:opacity-50
      `}
    >
      {icon}
    </button>
  );
};

export default EditorToggleButton;
