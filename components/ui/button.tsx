"use client";

import * as React from "react";

/** Tiny utility to join class names safely */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/** Minimal button – no icons, no children wrapping */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium",
          "bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
