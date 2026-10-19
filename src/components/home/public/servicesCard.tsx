
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { format, isValid, parseISO } from "date-fns";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string | number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function ServiceCard({ service }: { service: Service }) {
  const createdDate = service.createdAt
    ? parseISO(service.createdAt)
    : null;

  const formattedDate =
    createdDate && isValid(createdDate)
      ? format(createdDate, "MMM dd, yyyy")
      : null;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-video w-full">
        <Image
          src="/serviceImg.webp"
          alt={service.name || "Service"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />

        <div className="absolute right-3 top-3">
          <Badge variant={service.isActive ? "default" : "secondary"}>
            {service.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <CardHeader className="flex-1">
        <CardTitle className="line-clamp-2">
          {service.name || "Unnamed Service"}
        </CardTitle>

        <CardDescription className="line-clamp-3">
          {service.description || "No description available."}
        </CardDescription>

        {formattedDate && (
          <p className="text-xs text-muted-foreground">
            Added {formattedDate}
          </p>
        )}
      </CardHeader>

      <CardFooter className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Starting at</p>
          <p className="text-lg font-bold">
            ৳{service.price ?? "N/A"}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              BDT
            </span>
          </p>
        </div>

        <Button  disabled={!service.isActive}>
          <Link
            href={`/register?serviceId=${encodeURIComponent(service.id)}`}
            aria-label={`Request ${service.name}`}
          >
            Request Service
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
