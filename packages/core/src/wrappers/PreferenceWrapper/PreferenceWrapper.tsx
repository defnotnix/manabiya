"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import { usePreferences } from "@settle/core";
//props
import { PropPreferenceWrapper } from "./PreferenceWrapper.type";

export function PreferenceWrapper({
  testMode = false,
  appKey,
  userId,
  defaults = {},
  fetchPreferenceFn,
  version = "1.0",
  onVersionMismatch = async (pref) => pref,
}: PropPreferenceWrapper) {
  const { initializePreferences } = usePreferences((state) => state);

  // # Memoized preference key to avoid recomputation
  const preferenceKey = useMemo(() => `${appKey}_${userId}`, [appKey, userId]);

  // > Function to load preferences from server or cookies

  const loadPreferences = useCallback(async () => {
    try {
      // # States

      let _rawPreferences = fetchPreferenceFn
        ? await fetchPreferenceFn()
        : Cookies.get(preferenceKey);

      let _parsedPreferences: any = {};

      try {
        _parsedPreferences = _rawPreferences ? JSON.parse(_rawPreferences) : {};
      } catch (error) {
        console.error("Failed to parse preferences JSON:", error);
        _parsedPreferences = {};
      }

      // # Test Consoles

      if (testMode)
        console.log(
          "PreferenceWrapper_Cookie",
          "Latest Version:" + version,
          _parsedPreferences
        );

      // # Setting up Pref

      if (_parsedPreferences?.version !== version) {
        if (testMode)
          console.log(
            "Outdated Preferences, Initiating Migration",
            version + "->" + _parsedPreferences?.version
          );

        // > Versoin Control & Migration of Preferences

        initializePreferences(
          {
            ...onVersionMismatch(
              _rawPreferences ? _parsedPreferences : defaults
            ),
            version: version,
          },
          preferenceKey,
          defaults
        );
      } else {
        // > General Cookie Based Preference-Initialization

        initializePreferences(
          _rawPreferences ? _parsedPreferences : defaults,
          preferenceKey,
          defaults
        );
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
      initializePreferences(defaults, preferenceKey, defaults);
    }
  }, [
    fetchPreferenceFn,
    initializePreferences,
    preferenceKey,
    defaults,
    testMode,
  ]);

  // # Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return null;
}
