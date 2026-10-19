"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "cn";

function Dialog(props: DialogPrimitive.Root.Props) { return <DialogPrimitive.Root data-slot="dialog" {...props} />; }
function DialogTrigger(props: DialogPrimitive.Trigger.Props) { return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />; }
function DialogPortal(props: DialogPrimitive.Portal.Props) { return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />; }
function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return <DialogPrimitive.Backdrop data-slot="dialog-overlay" className={cn("fixed inset-0 z-50 bg-black/45 backdrop-blur-sm", className)} {...props} />;
}
function DialogContent({ className, children, ...props }: DialogPrimitive.Popup.Props) {
  return <DialogPortal><DialogOverlay /><DialogPrimitive.Popup data-slot="dialog-content" className={cn("fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border bg-background p-6 shadow-xl outline-none", className)} {...props}>{children}<DialogPrimitive.Close aria-label="Close" className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted"><X className="size-4" /></DialogPrimitive.Close></DialogPrimitive.Popup></DialogPortal>;
}
function DialogHeader(props: React.ComponentProps<"div">) { return <div className={cn("mb-5 flex flex-col gap-1.5", props.className)} {...props} />; }
function DialogTitle(props: DialogPrimitive.Title.Props) { return <DialogPrimitive.Title className={cn("text-lg font-semibold", props.className)} {...props} />; }
function DialogDescription(props: DialogPrimitive.Description.Props) { return <DialogPrimitive.Description className={cn("text-sm text-muted-foreground", props.className)} {...props} />; }

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription };
