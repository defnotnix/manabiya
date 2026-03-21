"use client";

import { Stack, TextInput, Text, Box, Image, Group, Center } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { SignatureIcon } from "@phosphor-icons/react";
import { FormWrapper } from "@settle/core";
import { useState, useEffect } from "react";

export function SignaturesForm() {
  const form = FormWrapper.useForm();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Sync image preview with form's signature_image value
  useEffect(() => {
    const formImage = form.getValues().signature_image;
    if (formImage instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(formImage);
    } else if (typeof formImage === "string" && formImage) {
      setImagePreview(formImage);
    } else {
      setImagePreview(null);
    }
  }, [form]);

  const handleImageDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        form.setFieldValue("signature_image", file);
        form.clearFieldError("signature_image");
      } else {
        form.setFieldError("signature_image", "Please upload an image file");
      }
    }
  };

  return (
    <Stack gap="md" p="md">
      <input type="hidden" {...form.getInputProps("id")} />
      <TextInput
        label="Person's Name"
        placeholder="e.g., Principal"
        required
        {...form.getInputProps("name")}
      />

      <Stack gap={0}>
        <TextInput
          label="Role"
          placeholder="e.g., Instructor, Managing Director"
          required
          leftSection={<Text size="xs">EN</Text>}
          {...form.getInputProps("role")}
        />
        <TextInput
          placeholder="Role (Japanese)"
          leftSection={<Text size="xs">JP</Text>}
          styles={{ input: { borderTop: 0, fontSize: "var(--mantine-font-size-xs)" } }}
          {...form.getInputProps("jp_role")}
        />
      </Stack>

      <Box>
        <Text size="xs" fw={900} mb="xs">Signature Image</Text>
        <Dropzone
          style={{
            border: "1px solid rgba(125,125,125,.3)"
          }}
          onDrop={handleImageDrop}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={5 * 1024 * 1024}
          accept={["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]}
        >
          {imagePreview ? (
            <Group justify="center" gap="xl" mih={150}>
              <Stack py="md" gap="md" align="center" justify="center" style={{ width: "100%", cursor: "pointer" }}>
                <Image
                  src={imagePreview}
                  alt="Signature preview"
                  h={100}
                  w="auto"
                  fit="contain"
                  style={{ borderRadius: "8px" }}
                />
                <Text size="xs" c="dimmed">Click to change</Text>
              </Stack>
            </Group>
          ) : (
            <Group justify="center" gap="xl" mih={150} style={{ pointerEvents: "none" }}>
              <Stack gap={0} align="center">
                <Center>
                  <SignatureIcon size={32} />
                </Center>
                <Text size="sm" c="dimmed">Drag image here or click to select</Text>
                <Text size="xs" c="dimmed">File should not exceed 5MB</Text>
              </Stack>
            </Group>
          )}
        </Dropzone>

        {form.errors.signature_image && (
          <Text size="sm" c="red" mt="xs">
            {form.errors.signature_image}
          </Text>
        )}
      </Box>
    </Stack>
  );
}
