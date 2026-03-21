"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  MARKING_API,
  BATCH_API
} from "../../module.config";
import { StudentsForm, STUDENT_FORM_STEPS } from "../../form/StudentsForm";
import { studentFormConfig } from "../../form/form.config";
import { FloatingClipboardButton } from "../../../../clipboard";

function NewPageContent() {
  const formProps = FormWrapper.useFormProps();

  return (
    <>
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
      <FloatingClipboardButton />
    </>
  );
}

export function NewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const batchId = searchParams.get("batch");
  const [defaultClassHours, setDefaultClassHours] = useState<string | null>(null);

  useEffect(() => {
    if (batchId) {
      const fetchBatchDetails = async () => {
        try {
          const res = await BATCH_API.getBatches();
          const batches = res.data || [];
          const selectedBatch = batches.find((b: any) => String(b.id) === batchId);
          if (selectedBatch?.per_class_hours) {
            setDefaultClassHours(selectedBatch.per_class_hours);
          }
        } catch (error) {
          console.error("Failed to fetch batch details:", error);
        }
      };
      fetchBatchDetails();
    }
  }, [batchId]);

  const initialValues = {
    ...studentFormConfig.initial,
    ...(batchId && { batch: batchId }),
    ...(defaultClassHours && { default_class_hours: defaultClassHours }),
  };

  return (
    <FormWrapper
      queryKey="students.new"
      formName="student-form"
      initial={initialValues}
      steps={studentFormConfig.steps}
      validation={studentFormConfig.validation}
      disabledSteps={studentFormConfig.disabledSteps}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => {
        // Keep original data for accessing nested arrays
        const originalData = data;

        // Check if data is FormData (multipart) or plain object (json)
        let isFormData = data instanceof FormData;
        let studentPayload: any;

        // If not FormData but has a File, convert to FormData
        if (!isFormData && data.image instanceof File) {
          const formData = new FormData();
          const studentFields = [
            'image', 'student_code', 'first_name', 'middle_name', 'last_name',
            'date_of_birth', 'gender', 'current_address', 'permanent_address',
            'batch', 'date_of_admission', 'date_of_completion', 'email', 'contact'
          ];

          studentFields.forEach(field => {
            const value = data[field];
            if (value !== null && value !== undefined) {
              formData.append(field, value);
            }
          });

          data = formData;
          isFormData = true;
        }

        // 1. Create the Student Core Information
        if (isFormData) {
          // For FormData, create a new FormData with only student fields
          studentPayload = new FormData();
          const studentFields = [
            'image', 'student_code', 'first_name', 'middle_name', 'last_name',
            'date_of_birth', 'gender', 'current_address', 'permanent_address',
            'batch', 'date_of_admission', 'date_of_completion', 'email', 'contact'
          ];

          studentFields.forEach(field => {
            const value = data.get(field);
            if (value !== null) {
              studentPayload.append(field, value);
            }
          });
        } else {
          // For JSON, use the plain object approach
          studentPayload = {
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
        }
        const studentRes = await STUDENT_API.createStudent(studentPayload);
        const studentId = studentRes.data.id;

        // Helper function to get value from original data (always use originalData for nested arrays)
        const getValue = (key: string) => {
          return originalData[key];
        };

        // 2. Create Contact Information (One-to-One)
        const contactPayload = {
          student: studentId,
          email: getValue('email'),
          contact: getValue('contact'),
          phone_number: getValue('phone_number'),
          emergency_contact_name: getValue('emergency_contact_name'),
          emergency_contact_relation: getValue('emergency_contact_relation'),
          emergency_contact_phone: getValue('emergency_contact_phone'),
        };
        await CONTACT_API.createContact(contactPayload);

        // 3. Create Nested Arrays (One-to-Many)
        const arrayPromises: Promise<any>[] = [];

        // Experiences
        const experiences = getValue('experiences');
        if (experiences && experiences.length > 0) {
          experiences.forEach((exp: any) => {
            arrayPromises.push(EXPERIENCE_API.createExperience({ ...exp, student: studentId }));
          });
        }

        // Educations
        const educations = getValue('educations');
        if (educations && educations.length > 0) {
          educations.forEach((edu: any) => {
            arrayPromises.push(EDUCATION_API.createEducation({ ...edu, student: studentId }));
          });
        }

        // Family Members
        const familyMembers = getValue('family_members');
        if (familyMembers && familyMembers.length > 0) {
          familyMembers.forEach((fam: any) => {
            arrayPromises.push(FAMILY_MEMBER_API.createFamilyMember({ ...fam, student: studentId }));
          });
        }

        // Grading (Singleton)
        const gradingPayload = {
          student: studentId,
          grammar: getValue('grading_grammar'),
          conversation: getValue('grading_conversation'),
          composition: getValue('grading_composition'),
          listening: getValue('grading_listening'),
          reading: getValue('grading_reading'),
          remarks: getValue('grading_remarks'),
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
        const markings = getValue('markings') || [];
        const defaultClassHours = getValue('default_class_hours');
        const activeMarkings = markings.filter((m: any) => m.total_days !== null || m.class_hours || m.present !== null || m.absent !== null || m.attendance_percent);
        if (activeMarkings.length > 0) {
          activeMarkings.forEach((mark: any) => {
            // Convert present and absent from days to hours
            const markingPayload = { ...mark, student: studentId };
            if (defaultClassHours && mark.present !== null && mark.present !== undefined) {
              markingPayload.present = Number(mark.present) * Number(defaultClassHours);
            }
            if (defaultClassHours && mark.absent !== null && mark.absent !== undefined) {
              markingPayload.absent = Number(mark.absent) * Number(defaultClassHours);
            }
            arrayPromises.push(MARKING_API.createMarking(markingPayload));
          });
        }

        // Await all nested creations
        await Promise.all(arrayPromises);

        return studentRes;
      }}
      submitSuccessFn={(response) => {
        const studentId = response?.data?.id;
        if (studentId) {
          router.push(`/admin/docs?student_id=${studentId}`);
        } else {
          router.push("/admin/students");
        }
      }}
    >
      <NewPageContent />
    </FormWrapper>
  );
}
