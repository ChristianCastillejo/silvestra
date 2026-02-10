"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-interaction)] text-sm font-medium ring-offset-white transition-colors transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline:
          "border border-input bg-background hover:bg-secondary hover:text-secondary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-8 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-10 text-base",
        icon: "h-10 w-10",
      },
      stable: {
        true: "active:scale-97",
        false: "hover:-translate-y-0.5 active:scale-97",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      stable: false,
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      stable,
      asChild = false,
      isLoading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, stable, className }))}
        ref={ref}
        disabled={props.disabled || isLoading}
        data-loading={isLoading}
        aria-busy={isLoading}
        {...props}
      >
        <div className="relative flex items-center justify-center gap-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {isLoading && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto", marginRight: 8 }}
                exit={{ opacity: 0, width: 0, marginRight: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center overflow-hidden"
              >
                <Spinner />
              </motion.span>
            )}
          </AnimatePresence>

          <span
            className={cn(
              "flex items-center gap-2 transition-opacity",
              isLoading && "opacity-80",
            )}
          >
            {children}
          </span>
        </div>
      </Comp>
    );
  },
);
Button.displayName = "Button";

function Spinner() {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
    >
      <path
        d="M12 2.25C6.61522 2.25 2.25 6.61522 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61522 17.3848 2.25 12 2.25Z"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12 2.25C17.3848 2.25 21.75 6.61522 21.75 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

export { Button, buttonVariants };