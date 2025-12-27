// ─────────────────────────────────────────────
// FormShell Props Type
// ─────────────────────────────────────────────

export type PropFormShellHeader = {
  bread?: Array<{
    label: string;
    link?: string;
  }>;
  moduleInfo?: any;
  title?: string;
};

export type PropFormShellStepper = {
  steps: string[];
  currentStep: number;
  disabledSteps?: number[];
  onStepChange?: (step: number) => void;
};

export type PropFormShell = PropFormShellHeader & {
  children: React.ReactNode;
  steps?: string[];
  disabledSteps?: number[];
  showStepper?: boolean;
  formName?: string;
  // Footer/Navigation props
  onStepBack?: () => void;
  onStepNext?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
};
