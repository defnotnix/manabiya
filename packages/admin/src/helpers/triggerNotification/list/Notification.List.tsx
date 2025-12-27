"use client";

import { notifications } from "@mantine/notifications";
//icons
import { Check, ExclamationMark, Info, Warning } from "@phosphor-icons/react";
//config
import { configTriggerNotification } from "../triggerNotification.config";
//type
import { propTriggerNotification } from "../triggerNotificaion.type";

function isLoading({
  title = "Loading Records",
  message = "Please wait while we grab the records",
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
  title = "Records Loaded Successfully!",
  message = "All records have been loaded and are now ready for view.",

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
  title = "Request Rejected!",
  message = "The server has rejected your request. Please reach out to the support team for assistance.",

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
  message = "We're sorry, but we couldn't process your request at this time. Please try again later.",

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

export const triggerNotificationList = {
  isLoading,
  isSuccess,
  isInfo,
  isError,
  isWarning,
};
