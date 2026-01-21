"use client";

import { Stack, Text, Textarea } from "@mantine/core";
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

export function StepPersonalStory() {
  const form = FormHandler.useForm();

  return (
    <Stack gap="md">
      <div>
        <Text size="2rem" lh="2.3rem">
          <b>Personal Story</b>
          <br />
        </Text>
        <Text size="xs">
          Tell us your personal story and what motivates you.
        </Text>
      </div>

      <Stack gap={0}>
        <Textarea
          label="Personal Story"
          placeholder="Share your personal story..."
          description="Your personal narrative and background"
          minRows={5}
          {...form.getInputProps("personal_story")}
          styles={styles.top}
        />
        <Textarea
          disabled={form.getValues().enable_translate}
          placeholder="あなたの個人的なストーリーを共有してください..."
          minRows={5}
          {...form.getInputProps("jp_personal_story")}
          styles={styles.bot}
        />
      </Stack>

      <Stack gap={0}>
        <Textarea
          label="Motivation"
          placeholder="What motivates you?"
          description="Your motivation and goals"
          minRows={5}
          {...form.getInputProps("motivation")}
          styles={styles.top}
        />
        <Textarea
          disabled={form.getValues().enable_translate}
          placeholder="あなたを動かすものは何ですか？"
          minRows={5}
          {...form.getInputProps("jp_motivation")}
          styles={styles.bot}
        />
      </Stack>
    </Stack>
  );
}
