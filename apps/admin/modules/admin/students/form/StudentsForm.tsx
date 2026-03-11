"use client";

import { FormWrapper } from "@settle/core";
import { Step1BasicInfo } from "./components/Step1BasicInfo";
import { Step2ContactInfo } from "./components/Step2ContactInfo";
import { Step3BackgroundInfo } from "./components/Step3BackgroundInfo";
import { Step4EnrollmentAcademic } from "./components/Step4EnrollmentAcademic";
import { Step5Review } from "./components/Step5Review";

interface StudentsFormProps {
  isLocked?: boolean;
}

export function StudentsForm({ isLocked = false }: StudentsFormProps) {
  const formProps = FormWrapper.useFormProps();
  const currentStep = formProps?.current ?? 0;

  const stepComponents = [
    <Step1BasicInfo key="step1" disabled={isLocked} />,
    <Step2ContactInfo key="step2" disabled={isLocked} />,
    <Step3BackgroundInfo key="step3" disabled={isLocked} />,
    <Step4EnrollmentAcademic key="step4" disabled={isLocked} />,
    <Step5Review key="step5" />,
  ];

  return stepComponents[currentStep] || stepComponents[0];
}

export { STUDENT_FORM_STEPS } from "./form.config";
