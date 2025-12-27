// * For Form Config

export type PropFormConfig = {
  // Form Configuration
  formName?: string;
  mode?: "uncontrolled" | "controlled";
  initial: any;
  validation: any[];
  steps: number;
  disabledSteps: number[];
};

// * For Notification Config

export type PropTriggerNotification = {
  title?: string;
  message?: string;
  autoClose?: number | false;
  onClose?: () => void;
};

// * For Trigger Notification

export type PropFormNotifications = {
  isLoading: (props: PropTriggerNotification) => void;
  isSuccess: (props: PropTriggerNotification) => void;
  isWarning: (props: PropTriggerNotification) => void;
  isError: (props: PropTriggerNotification) => void;
  isValidationError: (props: PropTriggerNotification) => void;
  isValidationStepError: (props: PropTriggerNotification) => void;
  isInfo: (props: PropTriggerNotification) => void;
};

// * Actual Form Type

export type PropFormWrapper = {
  queryKey?: string;
  children: React.ReactNode;

  // Test Mode
  testMode?: boolean;

  // Notifications
  notifications: PropFormNotifications;

  // Submission Configuration
  primaryKey?: string;
  apiSubmitFn?: (data: any, data_id?: any, initial?: any) => void;
  transformFnSubmit?: (formdata: any) => any;
  submitFormat?: "json" | "formdata";
  hasDirtCheck?: boolean;
  formatJsonSubmitConfig?: {
    keyIgnore?: string[];
    stringify?: string[];
  };
  formClearOnSuccess?: boolean;

  // Submission Lifecycle Hooks
  preSubmitFn?: (formdata: any) => Promise<any>;
  submitSuccessFn?: (res: any, formdata: any) => void;
  submitErrorFn?: (err: any, formdata: any) => void;

  // Step Validation
  stepValidationFn?: (current: number, formdata: any) => Promise<any>;
} & PropFormConfig;
