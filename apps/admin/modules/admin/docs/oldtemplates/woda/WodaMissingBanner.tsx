"use client";
import { Alert, Button, Group, List, Paper, Text, ThemeIcon } from "@mantine/core";
import { FormHandler } from "@/components/framework/FormHandler";
import classes from "./WodaMissingBanner.module.css";
import { ExclamationMarkIcon, PencilIcon } from "@phosphor-icons/react";

export interface RequiredField {
  key: string;
  label: string;
  /** Custom check — defaults to truthiness of the field value */
  check?: (val: any) => boolean;
}

export function WodaMissingBanner({ fields }: { fields: RequiredField[] }) {
  const form = FormHandler.useForm();
  const missing = fields.filter((f) => {
    const val = (form.values as any)?.[f.key];
    return f.check ? !f.check(val) : !val;
  });

  if (missing.length === 0) return null;

  return (
    <>
      <Paper
        p="md"
        my="xs"
        bg="orange.0"
        w="8.3in"
      >
        <Group wrap="nowrap">
          <ThemeIcon variant="light" color="orange">
            <ExclamationMarkIcon />
          </ThemeIcon>

          <Text size="xs" mb={4}>
            <b>The following fields are missing:</b> {
              missing.map((f) => f.label).join(", ")
            }
          </Text>

          <Button color="dark" variant="white" leftSection={<PencilIcon />} w={120} size="xs">
            Fix Now
          </Button>


        </Group>
      </Paper>
    </>
  )


}
