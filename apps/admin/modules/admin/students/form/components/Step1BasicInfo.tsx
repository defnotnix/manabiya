"use client";

import { Stack, TextInput, Select, Group, Image, Button, Text, Box, Center, useMantineTheme } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { DateInput } from "@mantine/dates";
import { FormWrapper } from "@settle/core";
import { GENDER_OPTIONS } from "../../module.config";
import { useState, useEffect } from "react";
import { UserFocusIcon, FloppyDiskIcon } from "@phosphor-icons/react";

interface Step1BasicInfoProps {
  disabled?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
}

export function Step1BasicInfo({ disabled = false, onSave, isSaving = false }: Step1BasicInfoProps) {
  const form = FormWrapper.useForm();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const theme = useMantineTheme();

  // Sync image preview with form's image value
  useEffect(() => {
    const formImage = form.getValues().image;
    if (formImage instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(formImage);
    } else if (typeof formImage === "string") {
      setImagePreview(formImage);
    } else {
      setImagePreview(null);
    }
  }, [form]);

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        form.setFieldError("image", "Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        form.setFieldError("image", "File size must be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Set form value
      form.setFieldValue("image", file);
      form.clearFieldError("image");
    }
  };

  return (
    <Stack gap="md">
      {onSave && (
        <Group justify="flex-end">
          <Button
            size="xs"
            loading={isSaving}
            onClick={onSave}
            leftSection={<FloppyDiskIcon size={14} />}
            disabled={disabled}
          >
            Save Changes
          </Button>
        </Group>
      )}

      <Box >
        <Text size="xs" fw={900} mb="xs">Student Picture</Text>
        <Dropzone
          bg="dark.6"
          style={{
            border: "1px solid rgba(125,125,125,.3)"
          }}
          radius="md"
          onDrop={handleDrop}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={5 * 1024 * 1024}
          accept={["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]}
          disabled={disabled}
        >
          {imagePreview ? (
            <Group justify="center" gap="xl" mih={200}>
              <Stack py="md" gap="md" align="center" justify="center" style={{ width: "100%", cursor: "pointer", position: "relative" }}>
                <Image

                  src={imagePreview}
                  alt="Student picture preview"
                  h={150}
                  w={150}
                  fit="cover"
                  style={{ borderRadius: "8px" }}
                />
                <Text size="xs" c="dimmed">Click to change</Text>
              </Stack>
            </Group>
          ) : (
            <Group justify="center" gap="xl" mih={200} style={{ pointerEvents: "none" }}>
              <Stack gap={0} align="center">
                <Center>
                  <UserFocusIcon size={32} />
                </Center>
                <Text size="sm" c="dimmed">Drag images here or click to select</Text>
                <Text size="xs" c="dimmed">File should not exceed 5MB</Text>
              </Stack>
            </Group>
          )}
        </Dropzone>

        {form.errors.image && (
          <Text size="sm" c="red" mt="xs">
            {form.errors.image}
          </Text>
        )}
      </Box>

      <Group grow align="flex-start">
        <Stack gap={0}>
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            required
            disabled={disabled}
            leftSection={<Text size="xs">EN</Text>}
            {...form.getInputProps("first_name")}
          />
          <TextInput
            placeholder="Enter first name (Japanese)"
            disabled={disabled}
            leftSection={<Text size="xs">JP</Text>}
            styles={{ input: { borderTop: 0, fontSize: "var(--mantine-font-size-xs)" } }}
            {...form.getInputProps("jp_first_name")}
          />
        </Stack>
        <Stack gap={0}>
          <TextInput
            label="Middle Name"
            placeholder="Enter middle name"
            disabled={disabled}
            leftSection={<Text size="xs">EN</Text>}
            {...form.getInputProps("middle_name")}
          />
          <TextInput
            placeholder="Enter middle name (Japanese)"
            disabled={disabled}
            leftSection={<Text size="xs">JP</Text>}
            styles={{ input: { borderTop: 0, fontSize: "var(--mantine-font-size-xs)" } }}
            {...form.getInputProps("jp_middle_name")}
          />
        </Stack>
        <Stack gap={0}>
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            required
            disabled={disabled}
            leftSection={<Text size="xs">EN</Text>}
            {...form.getInputProps("last_name")}
          />
          <TextInput
            placeholder="Enter last name (Japanese)"
            disabled={disabled}
            leftSection={<Text size="xs">JP</Text>}
            styles={{ input: { borderTop: 0, fontSize: "var(--mantine-font-size-xs)" } }}
            {...form.getInputProps("jp_last_name")}
          />
        </Stack>
      </Group>

      <Group grow align="flex-start">
        <DateInput
          label="Date of Birth"
          placeholder="Select date"
          disabled={disabled}
          valueFormat="YYYY-MM-DD"
          {...form.getInputProps("date_of_birth")}
        />
        <Select
          label="Gender"
          placeholder="Select gender"
          data={GENDER_OPTIONS}
          disabled={disabled}
          {...form.getInputProps("gender")}
        />
      </Group>

      <Stack gap={0}>
        <TextInput
          label="Current Address"
          placeholder="Enter current address"
          required
          disabled={disabled}
          leftSection={<Text size="xs">EN</Text>}
          {...form.getInputProps("current_address")}
        />
        <TextInput
          placeholder="Enter current address (Japanese)"
          disabled={disabled}
          leftSection={<Text size="xs">JP</Text>}
          styles={{ input: { borderTop: 0, fontSize: "var(--mantine-font-size-xs)" } }}
          {...form.getInputProps("jp_current_address")}
        />
      </Stack>

      <Stack gap={0}>
        <TextInput
          label="Permanent Address"
          placeholder="Enter permanent address"
          required
          disabled={disabled}
          leftSection={<Text size="xs">EN</Text>}
          {...form.getInputProps("permanent_address")}
        />
        <TextInput
          placeholder="Enter permanent address (Japanese)"
          disabled={disabled}
          leftSection={<Text size="xs">JP</Text>}
          styles={{ input: { borderTop: 0, fontSize: "var(--mantine-font-size-xs)" } }}
          {...form.getInputProps("jp_permanent_address")}
        />
      </Stack>


    </Stack>
  );
}
