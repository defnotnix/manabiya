"use client";

import { useRouter } from "next/navigation";
import { FormWrapper } from "@settle/core";
import { FormShell, triggerNotification } from "@settle/admin";
import {
  STUDENT_MODULE_CONFIG,
  STUDENT_API,
  CONTACT_API,
  EXPERIENCE_API,
  EDUCATION_API,
  FAMILY_MEMBER_API,
  GRADING_API,
  MARKING_API
} from "../../module.config";
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
        // 1. Create the Student Core Information
        const studentPayload = {
          student_code: data.student_code,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          current_address: data.current_address,
          permanent_address: data.permanent_address,
          batch: data.batch,
          date_of_admission: data.date_of_admission,
          date_of_completion: data.date_of_completion,
          email: data.email,
          contact: data.contact,
        };
        const studentRes = await STUDENT_API.createStudent(studentPayload);
        const studentId = studentRes.data.id;

        // 2. Create Contact Information (One-to-One)
        const contactPayload = {
          student: studentId,
          email: data.email,
          contact: data.contact,
          phone_number: data.phone_number,
          emergency_contact_name: data.emergency_contact_name,
          emergency_contact_relation: data.emergency_contact_relation,
          emergency_contact_phone: data.emergency_contact_phone,
        };
        await CONTACT_API.createContact(contactPayload);

        // 3. Create Nested Arrays (One-to-Many)
        const arrayPromises: Promise<any>[] = [];

        // Experiences
        if (data.experiences && data.experiences.length > 0) {
          data.experiences.forEach((exp: any) => {
            arrayPromises.push(EXPERIENCE_API.createExperience({ ...exp, student: studentId }));
          });
        }

        // Educations
        if (data.educations && data.educations.length > 0) {
          data.educations.forEach((edu: any) => {
            arrayPromises.push(EDUCATION_API.createEducation({ ...edu, student: studentId }));
          });
        }

        // Family Members
        if (data.family_members && data.family_members.length > 0) {
          data.family_members.forEach((fam: any) => {
            arrayPromises.push(FAMILY_MEMBER_API.createFamilyMember({ ...fam, student: studentId }));
          });
        }

        // Grading (Singleton)
        const gradingPayload = {
          student: studentId,
          grammar: data.grading_grammar,
          conversation: data.grading_conversation,
          composition: data.grading_composition,
          listening: data.grading_listening,
          reading: data.grading_reading,
          remarks: data.grading_remarks,
        };
        if (
          gradingPayload.grammar ||
          gradingPayload.conversation ||
          gradingPayload.composition ||
          gradingPayload.listening ||
          gradingPayload.reading ||
          gradingPayload.remarks
        ) {
          arrayPromises.push(GRADING_API.createGrading(gradingPayload));
        }

        // Markings
        const activeMarkings = (data.markings || []).filter((m: any) => m.total_days !== null || m.class_hours || m.present !== null || m.absent !== null || m.attendance_percent);
        if (activeMarkings.length > 0) {
          activeMarkings.forEach((mark: any) => {
            arrayPromises.push(MARKING_API.createMarking({ ...mark, student: studentId }));
          });
        }

        // Await all nested creations
        await Promise.all(arrayPromises);

        return studentRes;
      }}
      submitSuccessFn={() => {
        router.push("/admin/students");
      }}
    >
      <NewPageContent />
    </FormWrapper>
  );
}
