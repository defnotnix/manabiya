"use client";

import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { FormShellHeader } from "./components/Header";
import { Context as FormShellContext } from "./FormShell.context";
import { PropFormShell } from "./FormShell.type";
import { FormShellFooter, FormShellStepper } from "./components";

export function FormShell({
  bread,
  moduleInfo,
  title,
  children,
  steps = [],
  disabledSteps = [],
  showStepper = true,
  onStepBack,
  onStepNext,
  onCancel,
  isLoading = false,
  enableStepClick,
  enableStepCompleteClickOnly,
  enableStepTracking,
  iconActive,
  iconComplete,
  iconIncomplete,
}: PropFormShell) {
  const contextValue = {
    selectedRecords: [],
    setSelectedRecords: () => { },
  };

  const formProps = FormWrapper.useFormProps();
  const currentStep = formProps?.current || 0;

  return (
    <FormShellContext.Provider value={contextValue}>
      {/* Header */}
      <FormShellHeader bread={bread} moduleInfo={moduleInfo} title={title} />

      <Paper radius={0}>
        {showStepper && steps.length > 0 && (
          <FormShellStepper
            steps={steps}
            currentStep={currentStep}
            disabledSteps={disabledSteps}
            enableStepClick={enableStepClick}
            enableStepCompleteClickOnly={enableStepCompleteClickOnly}
            enableStepTracking={enableStepTracking}
            iconActive={iconActive}
            iconComplete={iconComplete}
            iconIncomplete={iconIncomplete}
          />
        )}

        <Container size="sm" py={32}>
          <Box component="div" flex={1}>
            {children}
          </Box>

          {/* Footer with Submit/Next/Back buttons */}
        </Container>

        <Container size="sm" py="sm">
          <FormShellFooter
            withStepper={showStepper && steps.length > 0}
            steps={steps}
            onStepBack={onStepBack}
            onStepNext={onStepNext}
            onCancel={onCancel}
            isLoading={isLoading}
          />
        </Container>
      </Paper>

      {/* Stepper */}
    </FormShellContext.Provider>
  );
}
