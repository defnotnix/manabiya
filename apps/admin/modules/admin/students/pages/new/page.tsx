"use client";

import { useRouter } from "next/navigation";
import { FormWrapper } from "@settle/core";
import { FormShell, triggerNotification } from "@settle/admin";
import { STUDENT_MODULE_CONFIG, STUDENT_API } from "../../module.config";
import { StudentsForm, STUDENT_FORM_STEPS } from "../../form/StudentsForm";
import { studentFormConfig } from "../../form/form.config";

function NewPageContent() {
  const formProps = FormWrapper.useFormProps();

  return (
    <FormShell
      moduleInfo={STUDENT_MODULE_CONFIG}
      title="Create New Student"
      bread={[
        { label: "Students", link: "/admin/students" },
        { label: "New" },
      ]}
      steps={STUDENT_FORM_STEPS}
      showStepper={true}
      enableStepTracking={true}
      onStepNext={formProps?.handleStepNext}
      onStepBack={formProps?.handleStepBack}
    >
      <StudentsForm />
    </FormShell>
  );
}

export function NewPage() {
  const router = useRouter();

  return (
    <FormWrapper
      queryKey="students.new"
      formName="student-form"
      initial={studentFormConfig.initial}
      steps={studentFormConfig.steps}
      validation={studentFormConfig.validation}
      disabledSteps={studentFormConfig.disabledSteps}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => {
        return STUDENT_API.createStudent(data);
      }}
      submitSuccessFn={() => {
        router.push("/admin/students");
      }}
    >
      <NewPageContent />
    </FormWrapper>
  );
}
