"use client";

import {
  Modal,
  Stack,
  TextInput,
  Group,
  Button,
  Switch,
  FileInput,
} from "@mantine/core";
import { FormHandler } from "@settle/core";
import { triggerNotification } from "@settle/admin";
import { SIGNATURE_API } from "../module.config";
import { signatureFormConfig } from "../form/form.config";
import { CheckIcon, XIcon, UploadIcon } from "@phosphor-icons/react";

interface SignatureModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: (signature: any) => void;
  editRecord?: any;
}

function SignatureForm({ onClose, isEdit }: { onClose: () => void; isEdit: boolean }) {
  const form = FormHandler.useForm();
  const { handleSubmit } = FormHandler.usePropContext();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Signature Name"
        placeholder="e.g., Principal"
        required
        {...form.getInputProps("name")}
      />

      <FileInput
        label="Signature Image"
        placeholder="Upload signature image"
        accept="image/*"
        leftSection={<UploadIcon size={14} />}
        {...form.getInputProps("signature_image")}
      />

      <Switch
        label="Active"
        {...form.getInputProps("is_active", { type: "checkbox" })}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="light" onClick={onClose} leftSection={<XIcon size={14} />} size="xs">
          Cancel
        </Button>
        <Button onClick={handleSubmit} leftSection={<CheckIcon size={14} />} size="xs">
          {isEdit ? "Update" : "Create"} Signature
        </Button>
      </Group>
    </Stack>
  );
}

export function SignatureModal({
  opened,
  onClose,
  onSuccess,
  editRecord,
}: SignatureModalProps) {
  const isEdit = !!editRecord;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit Signature" : "New Signature"}
      size="md"
    >
      <FormHandler
        initial={editRecord || signatureFormConfig.initial}
        formType={isEdit ? "edit" : "new"}
        validation={[{}]}
        submitFormData={true}
        apiSubmit={async (data, id) => {
          if (isEdit && id) {
            return SIGNATURE_API.updateSignature(String(id), data);
          }
          return SIGNATURE_API.createSignature(data);
        }}
        onSubmitSuccess={(res) => {
          onSuccess?.(res.data || res);
        }}
        triggerNotification={triggerNotification.form}
      >
        <SignatureForm onClose={onClose} isEdit={isEdit} />
      </FormHandler>
    </Modal>
  );
}
