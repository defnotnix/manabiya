"use client";

import { notifications } from "@mantine/notifications";
//icons
import { Check, ExclamationMark, Info, Warning } from "@phosphor-icons/react";
//config
import { configTriggerNotification } from "../triggerNotification.config";
//type
import { propTriggerNotification } from "../triggerNotificaion.type";

function isLoading({
  title = "Processing Authentication",
  message = "Please wait while we process your pass",
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
  title = "Authenticated Successfully!",
  message = "You have been successfully authenticated.",

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
  title = "Authentication Failed!",
  message = "We're sorry, but we couldn't process your request at this time. Please try again later.",

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
  title = "Auhentication Failed!",
  message = "We are",

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

function isTokenExpired({
  title = "Your Token Has Expired!",
  message = "Your token has expired. Please log in again to continue.",

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

export const triggerNotificationAuth = {
  isLoading,
  isSuccess,
  isInfo,
  isError,
  isWarning,
  isTokenExpired,
};
