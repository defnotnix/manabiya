"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FormWrapper } from "@settle/core";
import { FormShell, triggerNotification } from "@settle/admin";
import { Loader, Center, Alert, Button } from "@mantine/core";
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
  let id = params?.id as string;

  // If coming from DataTableShell with query params, redirect to correct format
  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    const idsParam = searchParams.get("ids");
    if (idsParam && (!id || id === "edit")) {
      router.push(`/admin/students/${idsParam}/edit`);
      return (
        <Center h="100vh">
          <Loader />
        </Center>
      );
    }
  }

  // Validate ID
  if (!id || id === "edit" || id === "new") {
    return (
      <Center h="100vh">
        <Alert color="red" title="Invalid Student ID">
          Please select a valid student to edit. <br />
          <Button mt="sm" onClick={() => router.push("/admin/students")}>
            Go Back to Students
          </Button>
        </Alert>
      </Center>
    );
  }

  const {
    data: student,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const response = await STUDENT_API.getStudent(id);
      console.log("Student API Response:", response);
      if (!response?.data) {
        console.error("No student data returned from API");
        throw new Error("Failed to fetch student");
      }
      return response.data;
    },
  });

  const {
    data: contact,
  } = useQuery({
    queryKey: ["contact", id],
    queryFn: async () => {
      const res = await CONTACT_API.getContactByStudent(String(id));
      return res.data;
    },
    enabled: !!student,
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
      initial={{
        ...student,
        email: student?.email || "",
        contact: student?.contact || "",
        phone_number: contact?.phone_number || "",
        emergency_contact_name: contact?.emergency_contact_name || "",
        emergency_contact_relation: contact?.emergency_contact_relation || "",
        emergency_contact_phone: contact?.emergency_contact_phone || "",
        grading_grammar: student?.gradings?.[0]?.grammar || "",
        grading_conversation: student?.gradings?.[0]?.conversation || "",
        grading_composition: student?.gradings?.[0]?.composition || "",
        grading_listening: student?.gradings?.[0]?.listening || "",
        grading_reading: student?.gradings?.[0]?.reading || "",
        grading_remarks: student?.gradings?.[0]?.remarks || "",
      }}
      primaryKey="id"
      steps={studentFormConfig.steps}
      validation={studentFormConfig.validation}
      disabledSteps={studentFormConfig.disabledSteps}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => {
        // 1. Update the Student Core Information
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
        const studentRes = await STUDENT_API.updateStudent(id, studentPayload);

        // 2. Update Contact Information
        if (contact?.id) {
          const contactPayload = {
            email: data.email,
            contact: data.contact,
            phone_number: data.phone_number,
            emergency_contact_name: data.emergency_contact_name,
            emergency_contact_relation: data.emergency_contact_relation,
            emergency_contact_phone: data.emergency_contact_phone,
          };
          await CONTACT_API.updateContact(String(contact.id), contactPayload);
        } else {
          // If no existing contact, create it
          const contactPayload = {
            student: id,
            email: data.email,
            contact: data.contact,
            phone_number: data.phone_number,
            emergency_contact_name: data.emergency_contact_name,
            emergency_contact_relation: data.emergency_contact_relation,
            emergency_contact_phone: data.emergency_contact_phone,
          };
          await CONTACT_API.createContact(contactPayload);
        }

        // Helper function to sync array entities
        const syncSubEntities = async (
          initialItems: any[],
          currentItems: any[],
          createApi: (body: any) => Promise<any>,
          updateApi: (id: string, body: any) => Promise<any>,
          deleteApi: (id: string) => Promise<any>
        ) => {
          const initialIds = initialItems?.map(item => item.id) || [];
          const currentIds = currentItems?.filter(item => item.id).map(item => item.id) || [];

          const itemsToCreate = currentItems?.filter(item => !item.id) || [];
          const itemsToUpdate = currentItems?.filter(item => item.id) || [];
          const itemsToDelete = initialIds.filter(id => !currentIds.includes(id));

          const promises: Promise<any>[] = [];

          itemsToCreate.forEach(item => promises.push(createApi({ ...item, student: id })));
          itemsToUpdate.forEach(item => promises.push(updateApi(String(item.id), item)));
          itemsToDelete.forEach(itemId => promises.push(deleteApi(String(itemId))));

          await Promise.all(promises);
        };

        // 3. Sync Nested Arrays
        await Promise.all([
          syncSubEntities(
            student?.experiences || [], data.experiences || [],
            EXPERIENCE_API.createExperience, EXPERIENCE_API.updateExperience, EXPERIENCE_API.deleteExperience
          ),
          syncSubEntities(
            student?.educations || [], data.educations || [],
            EDUCATION_API.createEducation, EDUCATION_API.updateEducation, EDUCATION_API.deleteEducation
          ),
          syncSubEntities(
            student?.family_members || [], data.family_members || [],
            FAMILY_MEMBER_API.createFamilyMember, FAMILY_MEMBER_API.updateFamilyMember, FAMILY_MEMBER_API.deleteFamilyMember
          ),
          (async () => {
            const gradingPayload = {
              grammar: data.grading_grammar,
              conversation: data.grading_conversation,
              composition: data.grading_composition,
              listening: data.grading_listening,
              reading: data.grading_reading,
              remarks: data.grading_remarks,
            };
            const hasGradingData = Object.values(gradingPayload).some(val => !!val);
            const existingGrading = student?.gradings?.[0];

            if (existingGrading) {
              return GRADING_API.updateGrading(String(existingGrading.id), gradingPayload);
            } else if (hasGradingData) {
              return GRADING_API.createGrading({ ...gradingPayload, student: id });
            }
          })(),
          syncSubEntities(
            student?.markings || [],
            (data.markings || []).filter((m: any) => m.total_days !== null || m.class_hours || m.present !== null || m.absent !== null || m.attendance_percent),
            MARKING_API.createMarking, MARKING_API.updateMarking, MARKING_API.deleteMarking
          ),
        ]);

        return studentRes;
      }}
      submitSuccessFn={() => {
        router.push("/admin/students");
      }}
    >
      <EditPageContent isLocked={isLocked} student={student} id={id} />
    </FormWrapper>
  );
}
