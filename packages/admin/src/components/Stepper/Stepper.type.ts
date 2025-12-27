import { HTMLAttributes } from "react";

export interface StepperStep {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  error?: boolean;
}

export interface PropStepper extends HTMLAttributes<HTMLDivElement> {
  steps: (string | StepperStep)[];
  active: number;
  onStepChange?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  iconSize?: number;
  completedIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
  allowStepClick?: boolean;
  allowStepSkip?: boolean;
}
