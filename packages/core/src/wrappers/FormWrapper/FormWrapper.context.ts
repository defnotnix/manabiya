"use client";

import { createFormContext } from "@mantine/form";
import { createContext, useContext } from "react";

//mantine-form-context
const [FormProvider, useFormContext, useForm]: any = createFormContext<any>();
//custom-form-context
const PropContext = createContext<any | undefined>(undefined);
const usePropContext = () => useContext(PropContext);

export { FormProvider, useFormContext, useForm, PropContext, usePropContext };
