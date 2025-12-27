"use client";

import { useMemo } from "react";
import cx from "clsx";
import { Check, X } from "@phosphor-icons/react";
import classes from "./Stepper.module.css";
import { PropStepper, StepperStep } from "./Stepper.type";

export function Stepper({
  steps,
  active,
  onStepChange,
  orientation = "horizontal",
  size = "md",
  iconSize = 20,
  completedIcon,
  errorIcon,
  allowStepClick = false,
  allowStepSkip = false,
  className,
  ...props
}: PropStepper) {
  // Normalize steps to StepperStep format
  const normalizedSteps = useMemo(
    () =>
      steps.map((step) =>
        typeof step === "string" ? { label: step } : step
      ),
    [steps]
  );

  const handleStepClick = (index: number) => {
    if (!allowStepClick || !onStepChange) return;

    // If allow skip is disabled, only allow clicking completed steps or adjacent steps
    if (!allowStepSkip) {
      if (index > active + 1) return;
    }

    onStepChange(index);
  };

  const getSizeClass = () => {
    switch (size) {
      case "xs":
        return classes.step_icon_xs;
      case "sm":
        return classes.step_icon_sm;
      case "lg":
        return classes.step_icon_lg;
      case "xl":
        return classes.step_icon_xl;
      default:
        return "";
    }
  };

  return (
    <div
      className={cx(
        classes.root,
        {
          [classes.root_vertical]: orientation === "vertical",
        },
        className
      )}
      {...props}
    >
      {normalizedSteps.map((step, index) => {
        const isActive = index === active;
        const isCompleted = index < active;
        const isError = step.error;
        const isClickable = allowStepClick && (isCompleted || isActive || (allowStepSkip && index <= active + 1));

        return (
          <div
            key={index}
            className={cx(classes.step_container, {
              [classes.step_container_vertical]: orientation === "vertical",
            })}
            style={{
              cursor: isClickable ? "pointer" : "default",
            }}
          >
            {/* Connector */}
            {index < normalizedSteps.length - 1 && (
              <div
                className={cx(
                  classes.step_connector,
                  {
                    [classes.step_connector_completed]: isCompleted,
                    [classes.step_connector_active]: isActive && !isCompleted,
                    [classes.step_connector_vertical]: orientation === "vertical",
                    [classes.step_connector_vertical_completed]:
                      isCompleted && orientation === "vertical",
                    [classes.step_connector_vertical_active]:
                      isActive && !isCompleted && orientation === "vertical",
                  }
                )}
              />
            )}

            {/* Step Content */}
            <div
              className={classes.step_content}
              onClick={() => handleStepClick(index)}
            >
              {/* Icon */}
              <div
                className={cx(classes.step_icon, getSizeClass(), {
                  [classes.step_icon_active]: isActive,
                  [classes.step_icon_completed]: isCompleted && !isError,
                  [classes.step_icon_error]: isError,
                })}
              >
                {isCompleted && !isError ? (
                  completedIcon ? (
                    completedIcon
                  ) : (
                    <Check weight="bold" size={iconSize} />
                  )
                ) : isError ? (
                  errorIcon ? (
                    errorIcon
                  ) : (
                    <X weight="bold" size={iconSize} />
                  )
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label & Description */}
              <div className={classes.step_label}>
                <div
                  className={cx(classes.step_title, {
                    [classes.step_title_active]: isActive,
                    [classes.step_title_completed]: isCompleted && !isError,
                  })}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className={classes.step_description}>
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
