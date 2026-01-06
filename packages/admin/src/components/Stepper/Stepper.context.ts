"use client";

import { createContext, useContext, ReactNode } from "react";

export interface StepConfig {
  index: number;
  label: string;
  description?: string;
  icon?: ReactNode;
  error?: boolean;
  allowStepSelect: boolean;
  children: ReactNode;
}

export interface StepperContextValue {
  active: number;
  onStepChange?: (index: number) => void;
  orientation: "horizontal" | "vertical";
  size: "xs" | "sm" | "md" | "lg" | "xl";
  iconSize: number;
  completedIcon?: ReactNode;
  errorIcon?: ReactNode;
  allowStepSkip: boolean;
  registerStep: (config: StepConfig) => void;
  unregisterStep: (index: number) => void;
  getNextIndex: () => number;
  steps: StepConfig[];
}

export const StepperContext = createContext<StepperContextValue | undefined>(
  undefined
);

export function useStepperContext() {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error(
      "useStepperContext must be used within a Stepper component"
    );
  }
  return context;
}
