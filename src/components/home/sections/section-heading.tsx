import { cn } from "cn";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <span className="text-sm font-semibold tracking-wide text-primary uppercase">
        {eyebrow}
      </span>

      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="max-w-2xl text-base leading-7 text-balance text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
