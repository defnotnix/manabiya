"use client";

import { create, ExtractState } from "zustand";
import { combine } from "zustand/middleware";

const useFormWrapperStore = create(
  combine(
    {
      current: 0,
    },
    (set, get) => {
      return {
        setStep: (step: number) => {
          set((state) => ({
            current: step,
          }));
        },
        resetStep: () => {
          set((state) => ({
            current: 0,
          }));
        },
      };
    }
  )
);

export { useFormWrapperStore };
