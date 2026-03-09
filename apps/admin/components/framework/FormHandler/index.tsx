"use client";

import { createContext, useContext, ReactNode } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

type FormValues = Record<string, any>;

const FormContext = createContext<{ values: FormValues }>({ values: {} });

// ─── Provider ─────────────────────────────────────────────────────────────────

function Provider({
  children,
  values = {},
}: {
  children: ReactNode;
  values?: FormValues;
}) {
  return (
    <FormContext.Provider value={{ values }}>
      {children}
    </FormContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useForm() {
  return useContext(FormContext);
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const FormHandler = { Provider, useForm };
