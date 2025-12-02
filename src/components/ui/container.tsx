"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const containerVariants = cva(
  "w-full mx-auto px-4 md:px-8",
  {
    variants: {
      size: {
        default: "max-w-[1400px]",
        medium: "max-w-[1300px]",
        full: "max-w-none",
        prose: "max-w-[65ch] prose prose-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean;
  as?: React.ElementType;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      size,
      asChild = false,
      as,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : (as ?? "div");

    return (
      <Comp
        className={cn(containerVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Container.displayName = "Container";

export { Container, containerVariants };
