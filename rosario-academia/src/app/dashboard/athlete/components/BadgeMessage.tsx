import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        success: "border-transparent bg-green-50 text-green-700",
        error: "border-transparent bg-red-50 text-red-700",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  },
);

export interface BadgeMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  message: string;
}

export function BadgeMessage({ className, variant, message, ...props }: BadgeMessageProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant === "success" ? (
        <CheckCircle className="mr-1 size-3" />
      ) : (
        <XCircle className="mr-1 size-3" />
      )}
      {message}
    </div>
  );
}
