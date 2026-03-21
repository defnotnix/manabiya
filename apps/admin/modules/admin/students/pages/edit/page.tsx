"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FormWrapper } from "@settle/core";
import { FormShell, triggerNotification } from "@settle/admin";
import { Loader, Center, Alert, Button } from "@mantine/core";
import { useState } from "react";
import { useIsAdmin } from "@/context/UserContext";
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
import { FloatingClipboardButton } from "../../../../clipboard";
import { LockedStudentBanner } from "../../components/LockedStudentBanner";

interface EditPageContentProps {
  isLocked: boolean;
  student: any;
  id: string;
}

function EditPageContent({ isLocked, student, id }: EditPageContentProps) {
  const formProps = FormWrapper.useFormProps();
  const [isSaving, setIsSaving] = useState(false);
  const currentStep = formProps?.current ?? 0;

  const saveStep1 = async () => {
    setIsSaving(true);
    try {
      const data = formProps?.form?.getValues?.();
      if (!data) return;

      const hasNewImage = data.image instanceof File;
      if (hasNewImage) {
        const fd = new FormData();
        const fields = [
          'image', 'student_code', 'first_name', 'middle_name', 'last_name',
          'date_of_birth', 'gender', 'current_address', 'permanent_address',
          'jp_first_name', 'jp_middle_name', 'jp_last_name',
          'jp_date_of_birth', 'jp_gender', 'jp_current_address', 'jp_permanent_address'
        ];
        fields.forEach(f => { if (data[f] != null) fd.append(f, data[f]); });
        await STUDENT_API.updateStudent(id, fd);
      } else {
        await STUDENT_API.updateStudent(id, {
          student_code: data.student_code,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          current_address: data.current_address,
          permanent_address: data.permanent_address,
          jp_first_name: data.jp_first_name,
          jp_middle_name: data.jp_middle_name,
          jp_last_name: data.jp_last_name,
          jp_date_of_birth: data.jp_date_of_birth,
          jp_gender: data.jp_gender,
          jp_current_address: data.jp_current_address,
          jp_permanent_address: data.jp_permanent_address,
        });
      }
      triggerNotification.form.isSuccess({ message: "Student information saved successfully" });
    } catch (err) {
      console.error("Error saving Step 1:", err);
      triggerNotification.form.isError({ message: "Failed to save student information" });
    } finally {
      setIsSaving(false);
    }
  };

  const saveStep2 = async () => {
    setIsSaving(true);
    try {
      const data = formProps?.form?.getValues?.();
      if (!data) return;

      // Update student email/contact
      await STUDENT_API.updateStudent(id, {
        email: data.email,
        contact: data.contact,
      });

      // Update or create contact
      if (student?.contact_detail?.id) {
        await CONTACT_API.updateContact(String(student.contact_detail.id), {
          phone_number: data.phone_number,
          emergency_contact_name: data.emergency_contact_name,
          emergency_contact_relation: data.emergency_contact_relation,
          emergency_contact_phone: data.emergency_contact_phone,
        });
      } else {
        await CONTACT_API.createContact({
          student: id,
          phone_number: data.phone_number,
          emergency_contact_name: data.emergency_contact_name,
          emergency_contact_relation: data.emergency_contact_relation,
          emergency_contact_phone: data.emergency_contact_phone,
        });
      }

      triggerNotification.form.isSuccess({ message: "Student information saved successfully" });
    } catch (err) {
      console.error("Error saving Step 2:", err);
      triggerNotification.form.isError({ message: "Failed to save student information" });
    } finally {
      setIsSaving(false);
    }
  };

  const saveStep3 = async () => {
    setIsSaving(true);
    try {
      const data = formProps?.form?.getValues?.();
      if (!data) return;

      const syncSubEntities = async (
        initialItems: Array<{ id: any }>,
        currentItems: Array<{ id?: any }>,
        createApi: (body: Record<string, any>) => Promise<any>,
        updateApi: (id: string, body: Record<string, any>) => Promise<any>,
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
      ]);

      triggerNotification.form.isSuccess({ message: "Student information saved successfully" });
    } catch (err) {
      console.error("Error saving Step 3:", err);
      triggerNotification.form.isError({ message: "Failed to save student information" });
    } finally {
      setIsSaving(false);
    }
  };

  const saveStep4 = async () => {
    setIsSaving(true);
    try {
      const data = formProps?.form?.getValues?.();
      if (!data) return;

      // Update student batch/dates
      await STUDENT_API.updateStudent(id, {
        batch: data.batch,
        date_of_admission: data.date_of_admission,
        date_of_completion: data.date_of_completion,
      });

      // Update or create grading
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
        await GRADING_API.updateGrading(String(existingGrading.id), gradingPayload);
      } else if (hasGradingData) {
        await GRADING_API.createGrading({ ...gradingPayload, student: id });
      }

      // Sync markings
      const syncSubEntities = async (
        initialItems: Array<{ id: any }>,
        currentItems: Array<{ id?: any }>,
        createApi: (body: Record<string, any>) => Promise<any>,
        updateApi: (id: string, body: Record<string, any>) => Promise<any>,
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

      await syncSubEntities(
        student?.markings || [],
        (data.markings || []).filter((m: Record<string, any>) => m.total_days !== null || m.class_hours || m.present !== null || m.absent !== null || m.attendance_percent),
        MARKING_API.createMarking, MARKING_API.updateMarking, MARKING_API.deleteMarking
      );

      triggerNotification.form.isSuccess({ message: "Student information saved successfully" });
    } catch (err) {
      console.error("Error saving Step 4:", err);
      triggerNotification.form.isError({ message: "Failed to save student information" });
    } finally {
      setIsSaving(false);
    }
  };

  const stepSaveFns = [saveStep1, saveStep2, saveStep3, saveStep4];
  const currentSaveFn = currentStep < 4 ? stepSaveFns[currentStep] : undefined;

  return (
    <>
      {isLocked && <LockedStudentBanner studentId={id} />}

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
        <StudentsForm isLocked={isLocked} onSave={currentSaveFn} isSaving={isSaving} />
      </FormShell>
      <FloatingClipboardButton />
    </>
  );
}

export function EditPage() {
  const router = useRouter();
  const params = useParams();
  const isAdmin = useIsAdmin();
  let id = params?.id as string;

  // Prevent non-admin users from editing students
  if (!isAdmin) {
    return (
      <Center h="100vh">
        <Alert
          color="red"
          title="Access Denied"
          styles={{ message: { color: "red" } }}
        >
          You do not have permission to edit student records. Only administrators can edit student data.
          <br />
          <Button
            mt="sm"
            onClick={() => router.push("/admin/students")}
            variant="filled"
            color="red"
          >
            Go Back to Students
          </Button>
        </Alert>
      </Center>
    );
  }

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
        image: student.image || null,
        student_code: student.student_code || "",
        first_name: student.first_name || "",
        middle_name: student.middle_name || "",
        last_name: student.last_name || "",
        date_of_birth: student.date_of_birth || null,
        gender: student.gender || "",
        current_address: student.current_address || "",
        permanent_address: student.permanent_address || "",
        // JP fields
        jp_first_name: student.jp_first_name || "",
        jp_middle_name: student.jp_middle_name || "",
        jp_last_name: student.jp_last_name || "",
        jp_date_of_birth: student.jp_date_of_birth || null,
        jp_gender: student.jp_gender || "",
        jp_current_address: student.jp_current_address || "",
        jp_permanent_address: student.jp_permanent_address || "",
        // Contact from contact_detail
        email: student.email || "",
        contact: student.contact || "",
        phone_number: student.contact_detail?.phone_number || "",
        emergency_contact_name: student.contact_detail?.emergency_contact_name || "",
        emergency_contact_relation: student.contact_detail?.emergency_contact_relation || "",
        emergency_contact_phone: student.contact_detail?.emergency_contact_phone || "",
        // Arrays
        experiences: student.experiences || [],
        educations: student.educations || [],
        family_members: student.family_members || [],
        // Enrollment
        batch: student.batch || null,
        date_of_admission: student.date_of_admission || null,
        date_of_completion: student.date_of_completion || null,
        // Grading
        grading_grammar: student.gradings?.[0]?.grammar || "",
        grading_conversation: student.gradings?.[0]?.conversation || "",
        grading_composition: student.gradings?.[0]?.composition || "",
        grading_listening: student.gradings?.[0]?.listening || "",
        grading_reading: student.gradings?.[0]?.reading || "",
        grading_remarks: student.gradings?.[0]?.remarks || "",
        marking_start_date: null,
        markings: student.markings || [],
      }}
      primaryKey="id"
      steps={studentFormConfig.steps}
      validation={studentFormConfig.validation}
      disabledSteps={studentFormConfig.disabledSteps}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => {
        // 1. Update the Student Core Information
        const hasImage = data.image instanceof File;
        let studentPayload: FormData | Record<string, any>;

        if (hasImage) {
          const fd = new FormData();
          const fields = [
            'image', 'student_code', 'first_name', 'middle_name', 'last_name',
            'date_of_birth', 'gender', 'current_address', 'permanent_address',
            'batch', 'date_of_admission', 'date_of_completion', 'email', 'contact',
            'jp_first_name', 'jp_middle_name', 'jp_last_name',
            'jp_date_of_birth', 'jp_gender', 'jp_current_address', 'jp_permanent_address'
          ];
          fields.forEach(f => { if (data[f] != null) fd.append(f, data[f]); });
          studentPayload = fd;
        } else {
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
            jp_first_name: data.jp_first_name,
            jp_middle_name: data.jp_middle_name,
            jp_last_name: data.jp_last_name,
            jp_date_of_birth: data.jp_date_of_birth,
            jp_gender: data.jp_gender,
            jp_current_address: data.jp_current_address,
            jp_permanent_address: data.jp_permanent_address,
          };
        }
        const studentRes = await STUDENT_API.updateStudent(id, studentPayload);

        // 2. Update Contact Information
        if (student?.contact_detail?.id) {
          const contactPayload = {
            phone_number: data.phone_number,
            emergency_contact_name: data.emergency_contact_name,
            emergency_contact_relation: data.emergency_contact_relation,
            emergency_contact_phone: data.emergency_contact_phone,
          };
          await CONTACT_API.updateContact(String(student.contact_detail.id), contactPayload);
        } else {
          // If no existing contact, create it
          const contactPayload = {
            student: id,
            phone_number: data.phone_number,
            emergency_contact_name: data.emergency_contact_name,
            emergency_contact_relation: data.emergency_contact_relation,
            emergency_contact_phone: data.emergency_contact_phone,
          };
          await CONTACT_API.createContact(contactPayload);
        }

        // Helper function to sync array entities
        const syncSubEntities = async (
          initialItems: Array<{ id: any }>,
          currentItems: Array<{ id?: any }>,
          createApi: (body: Record<string, any>) => Promise<any>,
          updateApi: (id: string, body: Record<string, any>) => Promise<any>,
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
            (data.markings || []).filter((m: Record<string, any>) => m.total_days !== null || m.class_hours || m.present !== null || m.absent !== null || m.attendance_percent),
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
