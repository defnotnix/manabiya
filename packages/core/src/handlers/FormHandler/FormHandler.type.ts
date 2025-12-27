import { AxiosResponse } from "axios";
import { ReactNode } from "react";
import { PropFormatJsonSubmit } from "../../helpers";

type FormHandler = {
  // * form
  initial: any;
  formType?: "new" | "edit" | string;

  // * steps
  steps?: string[];
  stepType?: string;
  stepClickable?: boolean;
  initialStep?: number;
  resetOnSubmit?: boolean;

  // * validation
  validation: any[];

  // * submit Props
  transformDataOnSubmit?: (data: any) => any;
  apiSubmit?: (body: any, id?: any) => Promise<AxiosResponse<any, any>> | any;
  submitProps?: PropFormatJsonSubmit;
  submitFormData?: boolean;

  // * handlers
  onSubmitSuccess?: (response?: any) => void;
  onSubmitError?: (response?: any) => void;
  onSubmitInitiate?: (response?: any) => void;

  // *
  triggerNotification?: any;
};

export type PropFormHandler = FormHandler & { children: ReactNode };
export type PropFormHandlerWithoutChildren = FormHandler;
