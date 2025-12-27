"use client";

import { notifications } from "@mantine/notifications";
//icons
import { Check, ExclamationMark, Info, Warning } from "@phosphor-icons/react";
//config
import { configTriggerNotification } from "../triggerNotification.config";
//type
import { propTriggerNotification } from "../triggerNotificaion.type";

function isLoading({
  title = "Processing!",
  message = "Please wait while we process your request.",
  autoClose = false,
  ...props
}: propTriggerNotification) {
  notifications.show({
    ...configTriggerNotification.isLoading,
    title,
    message,
    autoClose,
    ...props,
  });
}

function isSuccess({
  title = "Success!",
  message = "Request has been processed successfully!",

  ...props
}: propTriggerNotification) {
  notifications.update({
    ...configTriggerNotification.isSuccess,
    title,
    message,
    icon: <Check />,
    ...props,
  });
}

function isWarning({
  title = "Invalid request!",
  message = "The request is incorrect or invalid.",

  ...props
}: propTriggerNotification) {
  notifications.update({
    ...configTriggerNotification.isWarning,
    title,
    message,
    icon: <Warning />,
    ...props,
  });
}

function isError({
  title = "On Snap!",
  message = "Unfortunately your request was rejected. Please try again",

  ...props
}: propTriggerNotification) {
  notifications.update({
    ...configTriggerNotification.isError,
    title,
    message,
    icon: <ExclamationMark />,
    ...props,
  });
}

function isValidationError({
  title = "Incomplete or Invalid Fields Detected!",
  message = "Please ensure all fields are completed with accurate information.",

  ...props
}: propTriggerNotification) {
  notifications.update({
    ...configTriggerNotification.isError,
    title,
    message,
    icon: <ExclamationMark />,
    ...props,
  });
}

function isValidationStepError({
  title = "Incomplete or Invalid Fields Detected!",
  message = "Please ensure all fields are completed with accurate information.",

  ...props
}: propTriggerNotification) {
  notifications.show({
    ...configTriggerNotification.isError,
    title,
    message,
    icon: <ExclamationMark />,
    ...props,
  });
}

function isInfo({
  title = "A Quick Note!",
  message = "<info description missing>",

  ...props
}: propTriggerNotification) {
  notifications.update({
    ...configTriggerNotification.isInfo,
    title,
    message,
    icon: <Info />,
    ...props,
  });
}

export const triggerNotificationForm = {
  isLoading,
  isSuccess,
  isInfo,
  isError,
  isWarning,
  isValidationError,
  isValidationStepError,
};
