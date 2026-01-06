"use client";

import { useEffect, useRef } from "react";
import { useStepperContext } from "./Stepper.context";

export interface PropStepperStep {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  error?: boolean;
  allowStepSelect?: boolean;
  children: React.ReactNode;
}

export function StepperStep({
  label,
  description,
  icon,
  error = false,
  allowStepSelect = true,
  children,
}: PropStepperStep) {
  const context = useStepperContext();
  const indexRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const index = context.getNextIndex();
    indexRef.current = index;
    context.registerStep({
      index,
      label,
      description,
      icon,
      error,
      allowStepSelect,
      children,
    });

    return () => {
      if (indexRef.current !== undefined) {
        context.unregisterStep(indexRef.current);
      }
    };
  }, []);

  // Update step config when props change
  useEffect(() => {
    if (indexRef.current !== undefined) {
      context.registerStep({
        index: indexRef.current,
        label,
        description,
        icon,
        error,
        allowStepSelect,
        children,
      });
    }
  }, [label, description, icon, error, allowStepSelect, children, context]);

  return null;
}
