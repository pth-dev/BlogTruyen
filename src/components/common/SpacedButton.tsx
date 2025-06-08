import React from "react";
import { Button, type ButtonProps } from "../ui/button";
import { cn } from "../../utils/cn";

interface SpacedButtonProps extends ButtonProps {
  children: string;
  spacing?: "sm" | "md" | "lg" | "xl";
}

const spacingClasses = {
  sm: "tracking-[0.1em]",
  md: "tracking-[0.2em]",
  lg: "tracking-[0.3em]",
  xl: "tracking-[0.4em]",
};

export const SpacedButton: React.FC<SpacedButtonProps> = ({
  children,
  spacing = "lg",
  className,
  ...props
}) => {
  // Split text into individual characters
  const characters = children.split("");

  return (
    <Button
      className={cn(
        "relative overflow-hidden font-medium uppercase",
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      <span className="flex items-center justify-center">
        {characters.map((char, index) => (
          <span
            key={index}
            className={cn(
              "inline-block transition-all duration-300 ease-in-out",
              char === " " ? "w-2" : "hover:scale-110 hover:-translate-y-0.5"
            )}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </Button>
  );
};

// Preset variant for navigation use case
export const NavigationButton: React.FC<Omit<SpacedButtonProps, "spacing">> = (
  props
) => (
  <SpacedButton
    spacing="md"
    variant="ghost"
    className="text-gray-600 hover:text-gray-900 font-semibold"
    {...props}
  />
);
