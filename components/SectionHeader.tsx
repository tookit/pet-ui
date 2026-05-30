interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  label,
  title,
  description,
  className = "",
  align = "left",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`mb-12 ${alignClass} ${className}`} style={align === "center" ? { maxWidth: 560 } : undefined}>
      {label && (
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
          {label}
        </div>
      )}
      <h2 className="font-display text-[clamp(28px,3vw,36px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em]">
        {title}
      </h2>
      {description && (
        <p className="text-base text-neutral-500 mt-3 leading-relaxed max-w-[560px]">
          {description}
        </p>
      )}
    </div>
  );
}
