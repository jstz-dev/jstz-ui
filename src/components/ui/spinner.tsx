import { Loader2Icon, type LucideIcon, type LucideProps } from "lucide-react";

import { cn } from "../../lib/utils";

interface SpinnerProps extends LucideProps {
  Icon?: LucideIcon;
}

export function Spinner({ className, Icon = Loader2Icon, ...props }: SpinnerProps) {
  return (
    <Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}
