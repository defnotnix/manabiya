import { triggerNotificationForm } from "./form/Notification.Form";
import { triggerNotificationList } from "./list/Notification.List";
import { triggerNotificationAuth } from "./auth/Notification.Auth";

export const triggerNotification = {
  auth: triggerNotificationAuth,
  list: triggerNotificationList,
  form: triggerNotificationForm,
};
