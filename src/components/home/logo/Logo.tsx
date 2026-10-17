
import Link from "next/link";
import { Wrench } from "lucide-react";

interface LogoProps {
  href?: string;
  showText?: boolean;
  className?: string;
  iconSize?: number;
}

export default function Logo({
  href = "/",
  showText = true,
  className = "",
  iconSize = 20,
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Field Service Management System home"
      className={`group flex w-fit items-center gap-3 ${className}`}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <Wrench size={iconSize} strokeWidth={2.5} />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight tracking-tight">
            Field Service
          </span>
          <span className="mt-1 text-xs leading-tight text-muted-foreground">
            Management System
          </span>
        </div>
      )}
    </Link>
  );
}
