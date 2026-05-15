"use client";

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-amber-600 to-yellow-600 text-black hover:from-amber-500 hover:to-yellow-500 shadow-lg shadow-amber-900/40 active:scale-95",
        secondary:
          "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  )
}
