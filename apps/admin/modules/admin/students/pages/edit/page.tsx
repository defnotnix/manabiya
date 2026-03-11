"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FormWrapper } from "@settle/core";
import { FormShell, triggerNotification } from "@settle/admin";
import { Loader, Center, Alert } from "@mantine/core";
import { STUDENT_MODULE_CONFIG, STUDENT_API } from "../../module.config";
import { StudentsForm, STUDENT_FORM_STEPS } from "../../form/StudentsForm";
import { studentFormConfig } from "../../form/form.config";
import { LockedStudentBanner } from "../../components/LockedStudentBanner";

function EditPageContent({ isLocked, student, id }: any) {
  const formProps = FormWrapper.useFormProps();

  return (
    <>
      {isLocked && (
        <LockedStudentBanner
          studentId={id}
          lockedBy={student.locked_by}
          lockedAt={student.locked_at}
        />
      )}

      <FormShell
        moduleInfo={STUDENT_MODULE_CONFIG}
        title={`Edit Student: ${student.first_name} ${student.last_name}`}
        bread={[
          { label: "Students", link: "/admin/students" },
          { label: `${student.first_name} ${student.last_name}` },
          { label: "Edit" },
        ]}
        steps={STUDENT_FORM_STEPS}
        showStepper={true}
        enableStepTracking={true}
        onStepNext={formProps?.handleStepNext}
        onStepBack={formProps?.handleStepBack}
      >
        <StudentsForm isLocked={isLocked} />
      </FormShell>
    </>
  );
}

export function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const {
    data: student,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const response = await STUDENT_API.getStudent(id);
      return response?.data;
    },
  });

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (error || !student) {
    return (
      <Center h="100vh">
        <Alert color="red" title="Error">
          Failed to load student data.
        </Alert>
      </Center>
    );
  }

  const isLocked = student.locked;

  return (
    <FormWrapper
      queryKey={`students.edit.${id}`}
      formName="student-form"
      initial={student}
      primaryKey="id"
      steps={studentFormConfig.steps}
      validation={studentFormConfig.validation}
      disabledSteps={studentFormConfig.disabledSteps}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => {
        return STUDENT_API.updateStudent(id, data);
      }}
      submitSuccessFn={() => {
        router.push("/admin/students");
      }}
    >
      <EditPageContent isLocked={isLocked} student={student} id={id} />
    </FormWrapper>
  );
}
