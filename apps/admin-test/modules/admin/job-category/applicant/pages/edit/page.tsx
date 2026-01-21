"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FormWrapper } from "@settle/core";
import { FormShell } from "@settle/admin";
import { triggerNotification } from "@settle/admin";
import { APPLICANT_MODULE_CONFIG, APPLICANT_API } from "../../module.config";
import { ApplicantForm } from "../../form/ApplicantForm";
import { Loader, Center } from "@mantine/core";

export function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: applicant, isLoading } = useQuery({
    queryKey: ["applicant", id],
    queryFn: async () => {
      const response = await APPLICANT_API.getApplicant(id);
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

  return (
    <FormWrapper
      queryKey={`applicant.edit.${id}`}
      formName="applicant-form"
      initial={applicant}
      primaryKey="id"
      steps={1}
      validation={[]}
      disabledSteps={[]}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => {
        return APPLICANT_API.updateApplicant(id, data);
      }}
      submitSuccessFn={() => {
        router.push("/admin/applicant");
      }}
    >
      <FormShell
        moduleInfo={APPLICANT_MODULE_CONFIG}
        title="Edit Applicant"
        bread={[
          { label: "Applicants" },
          { label: applicant?.fullName || "Edit" },
        ]}
      >
        <ApplicantForm />
      </FormShell>
    </FormWrapper>
  );
}
