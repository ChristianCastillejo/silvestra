"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-black focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-text-white hover:bg-primary/80",
        secondary:
          "border-transparent bg-neutral-black text-text-white hover:bg-neutral-black/80",
        destructive:
          // SDE FIX: Usar 'text-text-white' para consistencia de tokens, no 'text-white'
          "border-transparent bg-red-500 text-text-white hover:bg-red-500/80",
        outline:
          // SDE FIX: Definir explícitamente el color del borde para que coincida con el diseño
          "text-text-black border-neutral-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
