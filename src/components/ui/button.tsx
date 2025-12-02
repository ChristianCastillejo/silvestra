"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-[10rem] border border-border bg-neutral-white px-5 py-[13px] text-base font-medium transition-ease disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        outline:
          "text-text-black border-border hover:bg-primary hover:text-text-white hover:border-primary",

        fill: "bg-primary text-text-white border-primary hover:opacity-90",

        secondary:
          "bg-neutral-black text-text-white border-neutral-black hover:bg-primary hover:border-primary",

        tertiary:
          "bg-neutral-white text-text-black border-neutral-black hover:bg-neutral-black hover:text-text-white",
      },
      size: {
        default: "px-5 py-[13px]",
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-4 text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
      fullWidth: true,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            <span
              className={cn(
                "inline-flex items-center justify-center gap-2 transition-opacity duration-200",
                isLoading ? "opacity-0" : "opacity-100"
              )}
            >
              {children}
            </span>

            {isLoading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
