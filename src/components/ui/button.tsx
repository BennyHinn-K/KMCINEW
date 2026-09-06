import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 press-lift",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-1 hover:shadow-2",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-1 hover:shadow-2",
        outline:
          "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-1",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground shadow-3 hover:shadow-glow hover:bg-accent/92",
        "outline-accent":
          "border-2 border-accent text-accent bg-transparent hover:bg-accent/10",
        glass:
          "bg-card/70 backdrop-blur-md border border-border text-ink shadow-glass hover:bg-card/90",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-lg",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10 rounded-lg",
        xs: "h-7 rounded-md px-2 text-xs",
        xl: "h-12 rounded-xl px-9 text-[0.95rem]",
        hero: "h-14 px-10 text-base rounded-pill shadow-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
