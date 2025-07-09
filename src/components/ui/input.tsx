import type { LucideProps } from "lucide-react";
import type { ComponentProps, ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../lib/utils";
import type { ButtonProps } from "./button";

interface InputProps extends Omit<ComponentProps<"input">, "children"> {
  renderIcon?: (props: LucideProps) => ReactNode;
  renderButton?: (props: ButtonProps) => ReactNode;
  classNames?: {
    container?: string;
  };
}

export function Input({
  className,
  type,
  renderIcon = () => null,
  renderButton = () => null,
  classNames = {},
  ...props
}: InputProps) {
  const icon = renderIcon({
    className: "size-5 absolute top-1/2 -translate-y-1/2 left-5 text-muted-foreground",
  });
  const button = renderButton({
    className:
      "absolute right-4 top-1/2 -translate-y-1/2 rounded-[calc(var(--input-radius)-var(--input-y-padding))]",
    type: "button",
  });

  return (
    <div
      className={cn(
        "relative [--input-radius:var(--radius-full)] [--input-y-padding:--spacing(1)]",
        classNames.container,
      )}
    >
      {icon}

      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input aria-invalid:outline-destructive/20 dark:aria-invalid:outline-destructive/40 aria-invalid:border-destructive focus-visible:outline-brand-blue-300 p-(--input-y-padding) shadow-xs flex h-12 w-full min-w-0 rounded-2xl border bg-transparent px-5 text-lg transition-[color,box-shadow] file:inline-flex file:h-9 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-base focus-visible:outline-[1.5px] focus-visible:outline-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
          icon && "pl-12",
          button && "rounded-(--input-radius) pr-30 h-14",
          className,
        )}
        {...props}
      />

      {button}
    </div>
  );
}

/**
 * BUG: Can't seem to make this work with any other compoentent than `Input`.
 *
 * Other components like `Select` or `Textarea` has to have their rounded property applied manually.
 */
export function InputGroup(props: ComponentPropsWithRef<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col",
        '[&>:first-child_[data-slot="input"]]:rounded-b-none',
        '[&>:last-child_[data-slot="input"]]:rounded-t-none',
        '[&_>_:not(:first-child):not(:last-child)_[data-slot="input"]]:rounded-none',
        "[&_>_:not(:first-child)]:border-t-0",
        props.className,
      )}
      {...props}
    />
  );
}
