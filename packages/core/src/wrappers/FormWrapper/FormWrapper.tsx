"use client";

import React, { useEffect } from "react";
//store
import { useFormWrapperStore } from "./FormWrapper.store";
//react-query
import { useMutation } from "@tanstack/react-query";
//helpers
import { formatJsonSubmit } from "@settle/core";
import { formWrapperErrorHandler } from "./FormWrapper.errorhandleer";
//context
import {
  FormProvider,
  useFormContext,
  useForm,
  PropContext,
  usePropContext,
} from "./FormWrapper.context";
//props
import { PropFormWrapper } from "./FormWrapper.type";

export function FormWrapper({
  // Debugging
  testMode = false,

  // Core
  children,
  queryKey = "general",
  formName = "general-form",
  mode = "uncontrolled",
  initial,

  // Steps Configuration
  steps = 1,
  disabledSteps = [],
  validation = [],
  stepValidationFn = async () => false,

  // Notifications
  notifications = {
    isLoading: () => {},
    isSuccess: () => {},
    isWarning: () => {},
    isError: () => {},
    isValidationError: () => {},
    isValidationStepError: () => {},
    isInfo: () => {},
  },

  // Submission Configuration
  primaryKey = "id",
  apiSubmitFn = () => {},
  transformFnSubmit = (formdata) => formdata,
  submitFormat = "json",
  hasDirtCheck = false,
  formatJsonSubmitConfig,
  formClearOnSuccess = true,

  // Submission Lifecycle Hooks
  preSubmitFn = async () => {},
  submitSuccessFn = (res) => {},
  submitErrorFn = (err) => {},
}: PropFormWrapper) {
  // * DEFINITIONS

  // * CONTEXTS

  // * STORE

  const current = useFormWrapperStore((state: any) => state.current);
  const setStep = useFormWrapperStore((state: any) => state.setStep);
  const resetStep = useFormWrapperStore((state: any) => state.resetStep);

  // * STATES

  const form = useForm({
    mode: mode,
    name: formName,
    initialValues: initial,
    //validate: validation.length > 0 ? validation[current] : undefined,
  });

  // * PRELOADING

  // * FUNCTIONS

  async function checkFormValidation() {
    const { hasErrors, errors } = await form.validate();
    const customErrors = await stepValidationFn(current, form.getValues());
    // > Setting Up Customer Error Validations
    if (customErrors) form.setErrors(customErrors);
    // > Test Console Logs
    if (testMode) {
      console.log("FormWrapper_ValidationCheck_err", hasErrors);
      console.log("FormWrapper_ValidationCheck_fn", customErrors);
    }

    return {
      err: hasErrors || !!customErrors,
      errObj: {
        type: "FE Validation Error",
        ...errors,
        ...customErrors,
      },
    };
  }

  // # CHECKS

  // # STEPS

  function findNextStep(step: number): number {
    while (step < steps - 1 && disabledSteps.includes(step + 1)) {
      step++;
    }
    return Math.min(step + 1, steps - 1);
  }

  function findBackStep(step: number): number {
    while (step > 0 && disabledSteps.includes(step - 1)) {
      step--;
    }
    return Math.max(step - 1, 0);
  }

  async function handleStepNext() {
    const hasErrors = await checkFormValidation();
    if (hasErrors.err) {
      notifications.isValidationStepError({});
    } else {
      setStep(findNextStep(current));
    }
  }

  async function handleStepBack() {
    setStep(findBackStep(current));
  }

  // # SUBMISSION

  async function mutationSubmitFn() {
    notifications.isLoading({});

    // > CUSTOM-TRANSFORM
    const _dataToProcess = transformFnSubmit(form.getValues());
    // > PROCESSING
    const _dataToSend = await formatJsonSubmit({
      data: _dataToProcess,
      dirtCheckValues: hasDirtCheck ? form.getValues()._dirt_check : {},
      formatToFormData: submitFormat === "formdata",
      ...formatJsonSubmitConfig,
    });

    // > Test Consoles

    if (testMode) {
      console.log("FormWrapper_FormValues", form.getValues());
      console.log("FormWrapper_DatatoSend", _dataToSend);
    }

    // > SUBMIT
    return apiSubmitFn(
      // ? Actual Data to Send
      _dataToSend,
      // ? ID for Edit Requests
      form.getValues()?.[primaryKey],
      // ? Full Initial Values
      form.getValues()
    );
  }

  async function onMutationSuccess(res: any) {
    submitSuccessFn(res, form.getValues());
    if (formClearOnSuccess) {
      form.reset();
    }
    notifications.isSuccess({});
    resetStep();
  }

  async function onMutationError(err: any) {
    submitErrorFn(err, form.getValues());
    formWrapperErrorHandler(err, notifications, form.setErrors);
  }

  const mutationSubmit = useMutation({
    mutationKey: [...queryKey.split("."), "form"],
    mutationFn: mutationSubmitFn,
    onSuccess: onMutationSuccess,
    onError: onMutationError,
  });

  async function handleSubmit() {
    if (!form.validate().hasErrors) {
      preSubmitFn(form.getValues());
      mutationSubmit.mutate();
    }
  }

  // * COMPONENTS

  return (
    <>
      <FormProvider form={form}>
        <PropContext.Provider
          value={{
            current,
            isLoading: mutationSubmit.isPending,
            handleStepNext,
            handleStepBack,
            handleSubmit,
          }}
        >
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
            }}
          >
            {children}
          </form>
        </PropContext.Provider>
      </FormProvider>
    </>
  );
}

FormWrapper.useForm = useFormContext;
FormWrapper.useFormProps = usePropContext;
