"use client";

import { SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { FormHandler } from "@settle/core";

const styles = {
  top: {
    input: {
      borderBottom: "none",
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      fontSize: "var(--mantine-font-size-xs)",
    },
    label: {
      fontSize: "var(--mantine-font-size-xs)",
    },
  },
  bot: {
    input: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      fontSize: "var(--mantine-font-size-xs)",
    },
    label: {
      fontSize: "var(--mantine-font-size-xs)",
    },
  },
};

export function StepPhysicalEmergency() {
  const form = FormHandler.useForm();

  return (
    <Stack gap="md">
      <div>
        <Text size="2rem" lh="2.3rem">
          <b>Physical & Emergency Contact</b>
          <br />
        </Text>
        <Text size="xs">
          Add physical information and emergency contact details.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, lg: 3 }}>
        <TextInput
          label="Height (cm)"
          placeholder="e.g. 180"
          description="Height in centimeters"
          {...form.getInputProps("height")}
        />
        <TextInput
          label="Weight (kg)"
          placeholder="e.g. 75"
          description="Weight in kilograms"
          {...form.getInputProps("weight")}
        />
        <TextInput
          label="Blood Type"
          placeholder="e.g. O+"
          description="Blood type"
          {...form.getInputProps("blood_type")}
        />
      </SimpleGrid>

      <Stack gap={0}>
        <TextInput
          label="Distinguishing Marks"
          placeholder="e.g. Birthmark on left arm"
          description="Any distinguishing marks or scars"
          {...form.getInputProps("distinguishing_marks")}
          styles={styles.top}
          leftSection={
            <Text size="xs" fw={800}>
              EN
            </Text>
          }
        />
        <TextInput
          disabled={form.getValues().enable_translate}
          placeholder="e.g. 左腕の生まれつきの跡"
          {...form.getInputProps("jp_distinguishing_marks")}
          styles={styles.bot}
          leftSection={
            <Text size="xs" fw={800}>
              JP
            </Text>
          }
        />
      </Stack>

      <Stack gap={0}>
        <TextInput
          label="Emergency Contact Name"
          placeholder="e.g. John Doe"
          description="Name of emergency contact person"
          {...form.getInputProps("emergency_contact_name")}
          styles={styles.top}
          leftSection={
            <Text size="xs" fw={800}>
              EN
            </Text>
          }
        />
        <TextInput
          disabled={form.getValues().enable_translate}
          placeholder="e.g. ジョン・ドウ"
          {...form.getInputProps("jp_emergency_contact_name")}
          styles={styles.bot}
          leftSection={
            <Text size="xs" fw={800}>
              JP
            </Text>
          }
        />
      </Stack>

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <TextInput
          label="Emergency Contact Number"
          placeholder="e.g. +1 234-567-8900"
          description="Phone number of emergency contact"
          {...form.getInputProps("emergency_contact_number")}
        />
        <TextInput
          label="Relationship"
          placeholder="e.g. Brother, Sister, Parent"
          description="Relationship to emergency contact"
          {...form.getInputProps("emergency_contact_relationship")}
        />
      </SimpleGrid>
    </Stack>
  );
}
