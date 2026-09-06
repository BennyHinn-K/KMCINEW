import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-pill px-md py-xs text-xs tracking-wide uppercase font-semibold press-lift focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-foreground shadow-1 hover:bg-accent/90",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        soft:
          "bg-accent-soft text-accent hover:bg-accent-soft/80",
        outline:
          "border border-border text-ink hover:bg-muted/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
