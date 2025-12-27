"use client";

const autoCloseDuration = 6000;

const id = "notification_list";

export const configTriggerNotification = {
  isLoading: {
    id,
    color: "blue",
    loading: true,
    autoClose: false,
    radius: "md",
    withCloseButton: false,
  },
  isSuccess: {
    id,
    color: "teal",
    loading: false,
    autoClose: autoCloseDuration,
    radius: "md",
    withCloseButton: true,
  },
  isInfo: {
    id,
    color: "blue",
    loading: false,
    autoClose: autoCloseDuration,
    radius: "md",
    withCloseButton: true,
  },
  isWarning: {
    id,
    color: "orange",
    loading: false,
    autoClose: autoCloseDuration,
    radius: "md",
    withCloseButton: true,
  },
  isError: {
    id,
    color: "red",
    loading: false,
    autoClose: autoCloseDuration,
    radius: "md",
    withCloseButton: true,
  },
};
