import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "ghost" | "light" | "outline-light";
  size?: "sm" | "md" | "lg";
  href?: string;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-primary-500 text-neutral-0 hover:bg-primary-600 hover:shadow-sm",
  secondary:
    "bg-transparent text-primary-600 border border-primary-300 hover:bg-primary-50",
  accent:
    "bg-accent-500 text-neutral-900 hover:bg-accent-700 hover:text-neutral-0",
  ghost:
    "bg-transparent text-neutral-600 hover:bg-neutral-100",
  light:
    "bg-neutral-0 text-primary-800 hover:bg-primary-50",
  "outline-light":
    "bg-transparent text-primary-200 border border-primary-700 hover:bg-primary-800 hover:border-primary-600",
};

const sizeClasses: Record<string, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  className = "",
  onClick,
}: ButtonProps) {
  const classes = [
    "inline-flex items-center gap-1.5 font-medium rounded-md cursor-pointer transition-[background,color,border-color,box-shadow] duration-fast no-underline whitespace-nowrap",
    variantClasses[variant] ?? variantClasses.primary,
    sizeClasses[size] ?? sizeClasses.md,
    className,
  ].join(" ");

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
