"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/utils/cn";
import { ArrowIcon } from "@/components/ui/icons/arrow-icon";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  variant?: "default" | "faq";
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, variant = "default", ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex-1 flex items-center justify-between gap-x-3 text-left md:text-lg font-medium text-gray-900 transition hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg cursor-pointer",
        className
      )}
      {...props}
    >
      {children}

      {variant === "faq" && (
        <ArrowIcon
          className={cn(
            "shrink-0 size-5 text-gray-600 transform group-hover:text-gray-500",
            "transition-transform duration-300",
            "data-[state=open]:-rotate-180"
          )}
          aria-hidden="true"
        />
      )}

      {variant === "default" && (
        <div className="relative flex items-center justify-center size-4 shrink-0">
          <span className="absolute h-px w-4 bg-gray-900 block" />

          <span
            className={cn(
              "absolute h-px w-4 bg-gray-900 block transition-all duration-300 ease-in-out",
              "rotate-90",
              "group-data-[state=open]:rotate-180 group-data-[state=open]:opacity-0"
            )}
          />
        </div>
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className={cn("pb-4 pt-0 text-base", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
