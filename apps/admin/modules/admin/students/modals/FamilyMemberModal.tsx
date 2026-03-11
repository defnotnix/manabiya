"use client";

import {
  Modal,
  Stack,
  TextInput,
  Select,
  Group,
  Button,
  NumberInput,
} from "@mantine/core";
import { FormHandler } from "@settle/core";
import { triggerNotification } from "@settle/admin";
import { FAMILY_MEMBER_API, RELATIONSHIP_OPTIONS } from "../module.config";
import { familyMemberFormConfig } from "../form/form.config";
import { CheckIcon, XIcon } from "@phosphor-icons/react";

interface FamilyMemberModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: (member: any) => void;
  studentId?: string | number; // Make studentId optional for local mode
  editRecord?: any;
  localMode?: boolean; // When true, skip API calls and just return data
}

function FamilyMemberForm({ onClose, isEdit }: { onClose: () => void; isEdit: boolean }) {
  const form = FormHandler.useForm();
  const { handleSubmit } = FormHandler.usePropContext();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Name"
        placeholder="Enter family member name"
        required
        {...form.getInputProps("name")}
      />

      <Group grow>
        <Select
          label="Relationship"
          placeholder="Select relationship"
          data={RELATIONSHIP_OPTIONS}
          required
          {...form.getInputProps("relationship")}
        />
        <NumberInput
          label="Age"
          placeholder="Enter age"
          min={0}
          max={150}
          {...form.getInputProps("age")}
        />
      </Group>

      <Group grow>
        <TextInput
          label="Occupation"
          placeholder="Enter occupation"
          {...form.getInputProps("occupation")}
        />
        <TextInput
          label="Contact"
          placeholder="Enter contact number"
          {...form.getInputProps("contact")}
        />
      </Group>

      <Group justify="flex-end" mt="md">
        <Button variant="light" onClick={onClose} leftSection={<XIcon size={14} />} size="xs">
          Cancel
        </Button>
        <Button onClick={handleSubmit} leftSection={<CheckIcon size={14} />} size="xs">
          {isEdit ? "Update" : "Add"} Family Member
        </Button>
      </Group>
    </Stack>
  );
}

export function FamilyMemberModal({
  opened,
  onClose,
  onSuccess,
  studentId,
  editRecord,
  localMode = false,
}: FamilyMemberModalProps) {
  const isEdit = !!editRecord;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit Family Member" : "Add Family Member"}
      size="md"
    >
      <FormHandler
        initial={editRecord || { ...familyMemberFormConfig.initial, student: studentId }}
        formType={isEdit ? "edit" : "new"}
        validation={[{}]}
        apiSubmit={async (data, id) => {
          if (localMode) {
            return {
              data: {
                ...data,
                ...(isEdit && editRecord?.localId ? { localId: editRecord.localId } : { localId: Math.random().toString(36).substr(2, 9) }),
              },
            };
          }
          if (isEdit && id) {
            return FAMILY_MEMBER_API.updateFamilyMember(String(id), data);
          }
          return FAMILY_MEMBER_API.createFamilyMember({ ...data, student: studentId });
        }}
        onSubmitSuccess={(res) => {
          onSuccess?.(res.data || res);
        }}
        triggerNotification={triggerNotification}
      >
        <FamilyMemberForm onClose={onClose} isEdit={isEdit} />
      </FormHandler>
    </Modal>
  );
}
