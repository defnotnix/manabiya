"use client";

import {
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { FormHandler } from "@settle/core";

const religions = [
  { label: "Hinduism", value: "Hinduism", jp: "ヒンドゥー教" },
  { label: "Buddhism", value: "Buddhism", jp: "仏教" },
  { label: "Christianity", value: "Christianity", jp: "キリスト教" },
  { label: "Islam", value: "Islam", jp: "イスラム教" },
  { label: "Sikhism", value: "Sikhism", jp: "シク教" },
  { label: "Jainism", value: "Jainism", jp: "ジャイナ教" },
  { label: "Other", value: "Other", jp: "その他" },
];

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
    option: {
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

export function StepBackgroundLegal() {
  const form = FormHandler.useForm();

  return (
    <Stack gap="md">
      <div>
        <Text size="2rem" lh="2.3rem">
          <b>Background & Legal Status</b>
          <br />
        </Text>
        <Text size="xs">
          Next add the background and legal information of the person.
        </Text>
      </div>

      <Select
        label="Marital Status"
        placeholder="Select your status"
        description="Current marital status"
        data={[
          { value: "Single", label: "Single" },
          { value: "Married", label: "Married" },
          { value: "Divorced", label: "Divorced" },
          { value: "Widowed", label: "Widowed" },
          { value: "Separated", label: "Separated" },
          { value: "Partnered", label: "Partnered" },
        ]}
        {...form.getInputProps("martial_status")}
      />

      <Stack gap={0}>
        <Select
          label="Religion"
          placeholder="e.g. Hinduism"
          description="Enter your religion"
          data={religions}
          value={form.values.religion}
          onChange={(value) => {
            const selected = religions.find((r) => r.value === value);
            form.setFieldValue("religion", value);
            form.setFieldValue("jp_religion", selected?.jp || "");
          }}
          styles={styles.top}
          leftSection={
            <Text size="xs" fw={800}>
              EN
            </Text>
          }
        />

        <TextInput
          disabled={form.getValues().enable_translate}
          value={form.values.jp_religion}
          readOnly
          styles={styles.bot}
          leftSection={
            <Text size="xs" fw={800}>
              JP
            </Text>
          }
        />
      </Stack>

      <SimpleGrid cols={2} spacing="xs" my="md">
        <Switch
          label="Drinks Alcohol"
          description="Indicate if you consume alcoholic beverages"
          {...form.getInputProps("drinks_alcohol", { type: "checkbox" })}
          styles={{
            label: {
              fontSize: "var(--mantine-font-size-xs)",
            },
          }}
        />
        <Switch
          label="Smokes"
          description="Indicate if you smoke tobacco products"
          {...form.getInputProps("smokes", { type: "checkbox" })}
          styles={{
            label: {
              fontSize: "var(--mantine-font-size-xs)",
            },
          }}
        />
      </SimpleGrid>

      <TextInput
        label="Japanese Level"
        placeholder="e.g. JLPT N4"
        description="Proficiency level in Japanese language"
        {...form.getInputProps("japanese_level")}
      />
    </Stack>
  );
}
