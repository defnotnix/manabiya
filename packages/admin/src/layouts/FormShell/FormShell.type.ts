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

export type Step = {
  label: string;
  description?: string;
};

export type PropFormShellStepper = {
  steps: (string | Step)[];
  currentStep: number;
  disabledSteps?: number[];
  onStepChange?: (step: number) => void;
  enableStepClick?: boolean;
  enableStepCompleteClickOnly?: boolean;
  enableStepTracking?: boolean;
  iconActive?: React.ReactNode;
  iconComplete?: React.ReactNode;
  iconIncomplete?: React.ReactNode;
};

export type PropFormShell = PropFormShellHeader & {
  children: React.ReactNode;
  steps?: (string | Step)[];
  disabledSteps?: number[];
  showStepper?: boolean;
  formName?: string;
  // Footer/Navigation props
  onStepBack?: () => void;
  onStepNext?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  // Stepper configuration props
  enableStepClick?: boolean;
  enableStepCompleteClickOnly?: boolean;
  enableStepTracking?: boolean;
  iconActive?: React.ReactNode;
  iconComplete?: React.ReactNode;
  iconIncomplete?: React.ReactNode;
};
