"use client";

import { createContext, useContext, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EditorHeaderProps = {
  height: number;      // in inches; added as Space above the document header
  enable: boolean;     // when true, ref-no / date row is hidden (handled by external letterhead)
  enableLine: boolean; // when true, the divider line below the header is hidden
};

export type EditorState = {
  headerProps: EditorHeaderProps;
  details: Record<string, any>;
};

export type EditorContextValue = {
  state: EditorState;
  dispatch: (action: any) => void;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_STATE: EditorState = {
  headerProps: {
    height: 0,
    enable: false,
    enableLine: false,
  },
  details: {},
};

// ─── Context ──────────────────────────────────────────────────────────────────

const Context = createContext<EditorContextValue>({
  state: DEFAULT_STATE,
  dispatch: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

function Provider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: Partial<EditorState>;
}) {
  const state: EditorState = {
    ...DEFAULT_STATE,
    ...initialState,
    headerProps: { ...DEFAULT_STATE.headerProps, ...initialState?.headerProps },
  };

  return (
    <Context.Provider value={{ state, dispatch: () => {} }}>
      {children}
    </Context.Provider>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const ContextEditor = { Context, Provider };
