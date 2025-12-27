import { PropFormNotifications } from "./FormWrapper.type";

export function formWrapperErrorHandler(
  err: any,
  notifications: PropFormNotifications,
  setError: any
) {
  let errObject = err.object?.response?.data;
  console.log(err);

  switch (errObject.type) {
    // > ERROR FROM DJANGO SERIALIZER
    case "Validation Error":
      setError(errObject);
      notifications.isError({
        title: "Whoops! Hold on a Moment 🖐️",
        message:
          "It seems some fields are missing or incorrect. Please review and resubmit.",
      });
      break;
    // > CUSTOM ERROR SENT FROM BACK END
    case "Error":
      if (errObject?._message) {
        notifications.isError({
          title: "Whoops! Hold on a Moment 🖐️",
          message:
            errObject?._message ||
            "It seems some fields are missing or incorrect. Please review and resubmit.",
        });
      } else {
        setError(errObject);
        notifications.isError({
          title: "Whoops! Hold on a Moment 🖐️",
          message:
            "It seems some fields are missing or incorrect. Please review and resubmit.",
        });
      }
      break;
    // > DEFAULT ERROR HANDLING
    default:
      notifications.isError({});
  }

  return errObject;
}
