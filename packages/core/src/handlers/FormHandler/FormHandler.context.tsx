"use client";

import { createFormContext } from "@mantine/form";
import { createContext, useContext } from "react";

const [FormProvider, useFormContext, useForm]: any = createFormContext<any>();

const PropContext = createContext<any | undefined>(undefined);
const usePropContext = () => useContext(PropContext);

export { FormProvider, useFormContext, useForm, PropContext, usePropContext };
