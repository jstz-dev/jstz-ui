"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "~/lib/utils";

type SeparatorProps = Omit<ComponentProps<typeof SeparatorPrimitive.Root>, "orientation"> &
  (
    | {
        orientation: "horizontal";
        children?: ReactNode;
      }
    | {
        orientation?: "vertical";
      }
  );

export function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  children,
  ...props
}: SeparatorProps) {
  if (!children) {
    return (
      <SeparatorPrimitive.Root
        data-slot="separator"
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <div className="flex items-center gap-4">
      <SeparatorPrimitive.Root
        data-slot="separator"
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "bg-border shrink-0 grow data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          className,
        )}
        {...props}
      />

      {children}

      <SeparatorPrimitive.Root
        data-slot="separator"
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "bg-border shrink-0 grow data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          className,
        )}
        {...props}
      />
    </div>
  );
}
