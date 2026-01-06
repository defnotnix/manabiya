"use client";

import { useMemo, useState, useRef, useCallback, ReactNode } from "react";
import cx from "clsx";
import { Check, X } from "@phosphor-icons/react";
import classes from "./Stepper.module.css";
import {
  PropStepper,
  StepperStep,
  PropStepperRoot,
} from "./Stepper.type";
import {
  StepperContext,
  StepConfig,
  StepperContextValue,
} from "./Stepper.context";

export function Stepper(
  props: PropStepper | (PropStepperRoot & { children?: ReactNode })
) {
  // Check if using old API (steps prop)
  if ("steps" in props) {
    return <StepperLegacy {...(props as PropStepper)} />;
  }

  // New compound component API
  return <StepperCompoundImpl {...(props as PropStepperRoot)} />;
}

function StepperLegacy({
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
        const isClickable =
          allowStepClick &&
          (isCompleted || isActive || (allowStepSkip && index <= active + 1));

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
                    [classes.step_connector_active]:
                      isActive && !isCompleted,
                    [classes.step_connector_vertical]:
                      orientation === "vertical",
                    [classes.step_connector_vertical_completed]:
                      isCompleted && orientation === "vertical",
                    [classes.step_connector_vertical_active]:
                      isActive &&
                      !isCompleted &&
                      orientation === "vertical",
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

function StepperCompoundImpl({
  active,
  onStepChange,
  orientation = "horizontal",
  size = "md",
  iconSize = 20,
  completedIcon,
  errorIcon,
  allowStepSkip = false,
  children,
  className,
  ...props
}: PropStepperRoot) {
  const [registeredSteps, setRegisteredSteps] = useState<StepConfig[]>([]);
  const stepCounterRef = useRef(0);

  // Reset counter at the start of each render
  stepCounterRef.current = 0;

  const getNextIndex = useCallback(() => {
    return stepCounterRef.current++;
  }, []);

  const registerStep = useCallback((config: StepConfig) => {
    setRegisteredSteps((prev) => {
      // Remove existing step with same index if it exists
      const filtered = prev.filter((s) => s.index !== config.index);
      const updated = [...filtered, config];
      // Sort by index to maintain order
      return updated.sort((a, b) => a.index - b.index);
    });
  }, []);

  const unregisterStep = useCallback((index: number) => {
    setRegisteredSteps((prev) => prev.filter((s) => s.index !== index));
  }, []);

  const contextValue: StepperContextValue = useMemo(
    () => ({
      active,
      onStepChange,
      orientation,
      size,
      iconSize,
      completedIcon,
      errorIcon,
      allowStepSkip,
      registerStep,
      unregisterStep,
      getNextIndex,
      steps: registeredSteps,
    }),
    [
      active,
      onStepChange,
      orientation,
      size,
      iconSize,
      completedIcon,
      errorIcon,
      allowStepSkip,
      registerStep,
      unregisterStep,
      getNextIndex,
      registeredSteps,
    ]
  );

  const handleStepClick = (index: number) => {
    const step = registeredSteps[index];
    if (!step || !step.allowStepSelect || !onStepChange) return;

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
    <StepperContext.Provider value={contextValue}>
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
        {/* Step Indicators Bar */}
        {registeredSteps.map((step, index) => {
          const isActive = index === active;
          const isCompleted = index < active;
          const isError = step.error;
          const isClickable =
            step.allowStepSelect &&
            (isCompleted || isActive || (allowStepSkip && index <= active + 1));

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
              {index < registeredSteps.length - 1 && (
                <div
                  className={cx(
                    classes.step_connector,
                    {
                      [classes.step_connector_completed]: isCompleted,
                      [classes.step_connector_active]:
                        isActive && !isCompleted,
                      [classes.step_connector_vertical]:
                        orientation === "vertical",
                      [classes.step_connector_vertical_completed]:
                        isCompleted && orientation === "vertical",
                      [classes.step_connector_vertical_active]:
                        isActive &&
                        !isCompleted &&
                        orientation === "vertical",
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

                {/* Label & Description - Only show when active */}
                {isActive && (
                  <div className={classes.step_label}>
                    <div
                      className={cx(classes.step_title, {
                        [classes.step_title_active]: isActive,
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
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Step Content Area */}
      <div className={classes.step_content_container}>
        {registeredSteps[active]?.children}
      </div>

      {/* Hidden area for Stepper.Step children to mount and register */}
      <div style={{ display: "none" }}>
        {children}
      </div>
    </StepperContext.Provider>
  );
}

// Attach Step component to Stepper
import { StepperStep as StepperStepComponent } from "./Stepper.Step";
Stepper.Step = StepperStepComponent;
