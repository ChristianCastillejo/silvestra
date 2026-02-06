import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"
import Link from "next/link"
import { LucideIcon } from "lucide-react"

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-3 px-8 py-3 rounded-full font-display font-medium text-sm border transition duration-300 ease-out cursor-pointer disabled:pointer-events-none disabled:opacity-50 w-full md:w-auto", {
  variants: {
    variant: {
      primary: "bg-primary text-neutral-white border-primary hover:opacity-90 shadow-lg shadow-primary/20",
      secondary: "bg-neutral-black text-text-white border-neutral-black",
      tertiary: "bg-neutral-white text-text-black border-neutral-black",
      ghost: "text-text-black border-border hover:bg-primary hover:text-neutral-white hover:border-primary",
    },
    stable: {
      true: "active:scale-[0.95]",
      false: "hover:-translate-y-0.5 active:scale-[0.95]",
    },
    size: {
      sm: "px-6 py-2 text-sm",
      default: "px-10 py-3 text-md",
      lg: "px-12 py-3 text-lg",
    },
  },
  defaultVariants: {
    variant: "secondary",
    stable: false,
    size: "default",
  },
}
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: LucideIcon | React.ElementType
  href?: string
  target?: string
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, stable, size, asChild = false, isLoading = false, icon: Icon, href, children, ...props }, ref) => {

    const internalContent = (
      <>
        <span
          className={cn(
            isLoading ? "opacity-0" : "opacity-100"
          )}
        >{children}
        </span>


        {Icon && (
          <Icon
            size={18}
            className={cn(
              "transition duration-300 ease-out opacity-90 group-hover:opacity-100",
              variant === "primary"
                ? "text-white"
                : "text-neutral-500 group-hover:text-black"
            )}
          />
        )}

        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 text-current"
              viewBox="0 0 26.349 26.35"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g><g>
                <circle cx="13.792" cy="3.082" r="3.082" />
                <circle cx="13.792" cy="24.501" r="1.849" />
                <circle cx="6.219" cy="6.218" r="2.774" />
                <circle cx="21.365" cy="21.363" r="1.541" />
                <circle cx="3.082" cy="13.792" r="2.465" />
                <circle cx="24.501" cy="13.791" r="1.232" />
                <path d="M4.694,19.84c-0.843,0.843-0.843,2.207,0,3.05c0.842,0.843,2.208,0.843,3.05,0c0.843-0.843,0.843-2.207,0-3.05 C6.902,18.996,5.537,18.988,4.694,19.84z" />
                <circle cx="21.364" cy="6.218" r="0.924" />
              </g></g>
            </svg>
          </span>
        )}
      </>
    )

    const commonClasses = cn(buttonVariants({ variant, stable, size, className }))

    if (asChild) {
      return (
        <Slot className={commonClasses} ref={ref} {...props}>
          {children}
        </Slot>
      )
    }

    if (href) {
      return (
        <Link
          href={href}
          className={commonClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          target={props.target || "_blank"}
          rel={props.target === "_blank" ? "noopener noreferrer" : undefined}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {internalContent}
        </Link>
      )
    }

    return (
      <button
        className={commonClasses}
        disabled={props.disabled || isLoading}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}

      >
        {internalContent}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }