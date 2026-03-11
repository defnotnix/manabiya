"use client";

import { Stack, Group } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { FormWrapper } from "@settle/core";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { SelectWithCreate } from "../../components/SelectWithCreate";
import { BATCH_API } from "../../module.config";
import { BatchModal } from "../../modals/BatchModal";

interface Step3EnrollmentInfoProps {
  disabled?: boolean;
}

export function Step3EnrollmentInfo({
  disabled = false,
}: Step3EnrollmentInfoProps) {
  const form = FormWrapper.useForm();

  // Modal states
  const [batchModalOpened, batchModalHandlers] = useDisclosure(false);

  // Fetch batches
  const { data: batchesData, refetch: refetchBatches } = useQuery({
    queryKey: ["batches"],
    queryFn: async () => {
      const res = await BATCH_API.getBatches();
      return res.data;
    },
  });

  const batchOptions = (batchesData || []).map((batch: any) => ({
    value: String(batch.id),
    label: batch.name,
  }));

  return (
    <>
      <Stack gap="md">
        <SelectWithCreate
          label="Batch"
          placeholder="Select or create batch"
          data={batchOptions}
          disabled={disabled}
          onAddNew={batchModalHandlers.open}
          value={form.values.batch ? String(form.values.batch) : null}
          onChange={(value) => form.setFieldValue("batch", value ? Number(value) : null)}
          error={form.errors.batch as string}
        />

        <Group grow>
          <DateInput
            label="Date of Admission"
            placeholder="Select admission date"
            disabled={disabled}
            valueFormat="YYYY-MM-DD"
            {...form.getInputProps("date_of_admission")}
          />
          <DateInput
            label="Date of Completion"
            placeholder="Select completion date"
            disabled={disabled}
            valueFormat="YYYY-MM-DD"
            {...form.getInputProps("date_of_completion")}
          />
        </Group>
      </Stack>

      {/* Batch Modal */}
      <BatchModal
        opened={batchModalOpened}
        onClose={batchModalHandlers.close}
        onSuccess={(newBatch) => {
          refetchBatches();
          form.setFieldValue("batch", newBatch.id);
          batchModalHandlers.close();
        }}
      />
    </>
  );
}
