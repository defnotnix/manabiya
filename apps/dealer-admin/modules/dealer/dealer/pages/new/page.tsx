"use client";

import { useRouter } from "next/navigation";
import { FormWrapper } from "@settle/core";
import { FormShell, triggerNotification } from "@settle/admin";
import { DEALER_API, DEALER_MODULE_CONFIG } from "../../module.config";
import { DealerForm } from "../../form/DealerForm";

export function NewPage() {
  const router = useRouter();

  return (
    <FormWrapper
      queryKey="dealer.new"
      formName="dealer-form"
      initial={{
        name: "",
      }}
      steps={1}
      validation={[]}
      disabledSteps={[]}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => {
        return DEALER_API.createDealer(data);
      }}
      submitSuccessFn={() => {
        router.push("/dealer/dealer");
      }}
    >
      <FormShell
        moduleInfo={DEALER_MODULE_CONFIG}
        title="Create New Dealer"
        bread={[{ label: "Dealers" }, { label: "New" }]}
      >
        <DealerForm />
      </FormShell>
    </FormWrapper>
  );
}
