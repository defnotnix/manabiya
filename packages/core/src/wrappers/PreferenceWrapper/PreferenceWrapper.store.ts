"use client";

import { create, ExtractState } from "zustand";
import { combine } from "zustand/middleware";
//cookie
import Cookies from "js-cookie";

const updateCookie = (key: string, value: any) => {
  Cookies.set(key, JSON.stringify(value), {
    expires: 365,
    path: "/",
  });
};

const usePreferenceWrapperStore = create(
  combine(
    {
      defaults: {},
      preferenceKey: "",
      preferences: {} as any,
    },
    (set, get) => {
      return {
        // > INITIALIZE

        initializePreferences: (
          preferences: any,
          preferenceKey: string,
          defaults: any
        ) => {
          console.log(preferenceKey, preferences);
          set((state) => {
            if (state.preferenceKey) updateCookie(preferenceKey, preferences);

            return {
              defaults,
              preferenceKey,
              preferences: preferences,
            };
          });
        },

        // > ADD COOKIE PREFERENCE

        addPreference: ({
          group,
          key,
          value,
        }: {
          group: string;
          key: string;
          value: any;
        }) => {
          set((state) => {
            if (state.preferences[group]?.[key]) {
              return state;
            } else {
              const _pref = {
                preferences: {
                  ...state.preferences,
                  [group]: {
                    ...state.preferences[group],
                    [key]: value,
                  },
                },
              };

              if (state.preferenceKey)
                updateCookie(state.preferenceKey, _pref.preferences);

              return _pref;
            }
          });
        },

        // > ADD COOKIE PREFERENCE BY GROUP

        // > SET TO DEFAULT

        setDefaultPreferences: (defaults: any) => {
          set((state) => {
            const _pref = {
              preferenceKey: state.preferenceKey,
              preferences: state.defaults,
            };

            updateCookie(state.preferenceKey, _pref.preferences);

            return _pref;
          });
        },
      };
    }
  )
);

export { usePreferenceWrapperStore };
