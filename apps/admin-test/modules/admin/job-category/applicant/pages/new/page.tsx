"use client";

import { useRouter } from "next/navigation";
import { FormWrapper } from "@settle/core";
import { FormShell } from "@settle/admin";
import { APPLICANT_MODULE_CONFIG } from "../../module.config";
import { ApplicantForm, STEPS } from "../../form/ApplicantForm";
import { APPLICANT_FORM_CONFIG } from "../../form/form.props";

export function NewPage() {
  const router = useRouter();

  return (
    <FormWrapper
      {...APPLICANT_FORM_CONFIG}
      submitSuccessFn={() => {
        router.push("/admin/applicant");
      }}
    >
      <FormShell
        moduleInfo={APPLICANT_MODULE_CONFIG}
        title="Create New Applicant"
        bread={[{ label: "Applicants" }, { label: "New" }]}
        steps={STEPS}
        showStepper={true}
      >
        <ApplicantForm />
      </FormShell>
    </FormWrapper>
  );
}
