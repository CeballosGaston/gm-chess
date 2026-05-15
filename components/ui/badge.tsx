import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "font-bold rounded border border-amber-500/30 uppercase",
  {
    variants: {
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        badgeVariants({ size }),
        "bg-amber-500/20 text-amber-400",
        className,
      )}
      {...props}
    />
  )
}
