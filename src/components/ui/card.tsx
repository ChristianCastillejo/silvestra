"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative group rounded-2xl overflow-hidden", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-4 flex flex-col gap-2", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

const cardBadgePositionVariants = cva("absolute z-10", {
  variants: {
    position: {
      topLeft: "top-[1rem] left-[1rem]",
      topRight: "top-[1rem] right-[1rem]",
      bottomLeft: "bottom-[1rem] left-[1rem]",
    },
  },
  defaultVariants: {
    position: "topRight",
  },
});

export interface CardBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardBadgePositionVariants> {}

const CardBadge = React.forwardRef<HTMLDivElement, CardBadgeProps>(
  ({ className, position, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardBadgePositionVariants({ position, className }))}
      {...props}
    />
  )
);
CardBadge.displayName = "CardBadge";

export { Card, CardHeader, CardContent, CardFooter, CardBadge };
