import * as ProgressPrimitive from "@radix-ui/react-progress";

import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

interface ProgressProps extends ComponentProps<typeof ProgressPrimitive.Root> {
  indicatorProps: ComponentProps<typeof ProgressPrimitive.Indicator>;
}

export function Progress({ className, value, indicatorProps, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("bg-primary/20 relative h-2 w-full overflow-hidden rounded-full", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        {...indicatorProps}
        data-slot="progress-indicator"
        className={cn("bg-primary h-full w-full flex-1 transition-all", indicatorProps.className)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
