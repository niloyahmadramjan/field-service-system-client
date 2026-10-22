import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "../home/logo/Logo";

interface LoadingProps {
  text?: string;
  description?: string;
  fullScreen?: boolean;
  showLogo?: boolean;
  className?: string;
}

export default function Loading({
  text = "Loading...",
  description = "Please wait while we get things ready.",
  fullScreen = false,
  showLogo = true,
  className,
}: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        fullScreen && "min-h-screen w-full bg-background",
        className,
      )}
    >
      {showLogo && <Logo href="/" iconSize={22} />}

      <div className="relative flex size-16 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/15 border-t-primary" />

        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-semibold tracking-tight text-foreground">
          {text}
        </p>

        {description && (
          <p className="max-w-xs text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="h-1 w-32 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
      </div>
    </div>
  );
}

{
  /* <Loading
  showLogo={false}
  text="Signing you in"
  description="Verifying your credentials..."
  className="py-12"
/> */
}

// {isLoading ? (
//   <Loading
//     text="Loading services"
//     description="Fetching available services..."
//   />
// ) : (
//   <ServiceList services={services} />
// )}

// import Loading from "@/components/common/loading";

// export default function Page() {
//   return (
//     <Loading
//       fullScreen
//       text="Loading your dashboard"
//       description="Preparing your field operations..."
//     />
//   );
// }
