import { HTMLAttributes } from "react";

export interface StepperStep {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  error?: boolean;
}

/** @deprecated Use PropStepperRoot instead */
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

export interface PropStepperRoot extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  active: number;
  onStepChange?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  iconSize?: number;
  completedIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
  allowStepSkip?: boolean;
  children: React.ReactNode;
}

export interface PropStepperStep {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  error?: boolean;
  allowStepSelect?: boolean;
  children: React.ReactNode;
}
