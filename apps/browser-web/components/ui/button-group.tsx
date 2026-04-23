import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          "[&>*]:rounded-none [&>*:focus-visible]:z-10 [&>*:hover]:z-10",
          orientation === "horizontal"
            ? "[&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md -space-x-px"
            : "[&>*:first-child]:rounded-t-md [&>*:last-child]:rounded-b-md -space-y-px",
          className
        )}
        {...props}
      />
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup }
