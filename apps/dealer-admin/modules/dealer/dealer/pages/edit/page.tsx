"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FormWrapper } from "@settle/core";
import { FormShell, triggerNotification } from "@settle/admin";
import { Loader, Center } from "@mantine/core";
import { DEALER_API, DEALER_MODULE_CONFIG } from "../../module.config";
import { DealerForm } from "../../form/DealerForm";

export function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: dealer, isLoading } = useQuery({
    queryKey: ["dealer", id],
    queryFn: async () => {
      const response = await DEALER_API.getDealer(id);
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
      queryKey={`dealer.edit.${id}`}
      formName="dealer-form"
      initial={dealer}
      primaryKey="id"
      steps={1}
      validation={[]}
      disabledSteps={[]}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => {
        return DEALER_API.updateDealer(id, data);
      }}
      submitSuccessFn={() => {
        router.push("/dealer/dealer");
      }}
    >
      <FormShell
        moduleInfo={DEALER_MODULE_CONFIG}
        title="Edit Dealer"
        bread={[{ label: "Dealers" }, { label: dealer?.name || "Edit" }]}
      >
        <DealerForm />
      </FormShell>
    </FormWrapper>
  );
}
