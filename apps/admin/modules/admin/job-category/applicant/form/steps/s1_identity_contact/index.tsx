"use client";

import {
  Center,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Select,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  FacebookLogoIcon,
  InfoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
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

export function StepIdentityContact() {
  const form = FormHandler.useForm();

  return (
    <>
      <Stack gap="md">
        <div>
          <Text size="2rem" lh="2.3rem">
            <b>Identity & Contact Details</b>
            <br />
          </Text>
          <Text size="xs">
            Let's begin by adding the identity of the person and some general
            details.
          </Text>
        </div>

        <Space h="md" />

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="xs">
          <Stack gap={0}>
            <TextInput
              label="First Name"
              placeholder="e.g. Taro Tanaka"
              description="Enter your full legal name as in passport"
              {...form.getInputProps("first_name")}
              styles={styles.top}
              leftSection={
                <Text size="xs" fw={800}>
                  EN
                </Text>
              }
            />
            <TextInput
              placeholder="e.g. タナカ タロウ"
              disabled={form.getValues().enable_translate}
              {...form.getInputProps("jp_first_name")}
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
              label="Middle Name"
              placeholder="e.g. Tanaka"
              description="Enter your full legal name as in passport"
              {...form.getInputProps("middle_name")}
              styles={styles.top}
              leftSection={
                <Text size="xs" fw={800}>
                  EN
                </Text>
              }
            />
            <TextInput
              disabled={form.getValues().enable_translate}
              placeholder="e.g. タナカ タロウ"
              {...form.getInputProps("jp_middle_name")}
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
              label="Last Name"
              placeholder="e.g. Tanaka"
              description="Enter your full legal name as in passport"
              {...form.getInputProps("last_name")}
              styles={styles.top}
              leftSection={
                <Text size="xs" fw={800}>
                  EN
                </Text>
              }
            />
            <TextInput
              disabled={form.getValues().enable_translate}
              placeholder="e.g. タナカ タロウ"
              {...form.getInputProps("jp_last_name")}
              styles={styles.bot}
              leftSection={
                <Text size="xs" fw={800}>
                  JP
                </Text>
              }
            />
          </Stack>
        </SimpleGrid>

        <TextInput
          label="Youtube URL"
          placeholder="e.g. https://www.youtube.com/watch?v=nBydCvT195k"
          description="Under the video Click on Share > Embed > Copy the URL and paste it here"
          {...form.getInputProps("youtube_link")}
          leftSection={
            <Text size="xs" fw={800}>
              EN
            </Text>
          }
        />

        <Stack gap={0}>
          <TextInput
            label="About Me (Introduction)"
            placeholder="e.g. I am ...."
            description="About me section of the CV"
            {...form.getInputProps("remark")}
            styles={styles.top}
            leftSection={
              <Text size="xs" fw={800}>
                EN
              </Text>
            }
          />
          <TextInput
            disabled={form.getValues().enable_translate}
            placeholder="e.g. タナカ タロウ"
            {...form.getInputProps("jp_remark")}
            styles={styles.bot}
            leftSection={
              <Text size="xs" fw={800}>
                JP
              </Text>
            }
          />
        </Stack>

        <SimpleGrid cols={{ base: 1, lg: 3 }}>
          <Select
            clearable={false}
            label="Job Category"
            placeholder="Select your job category"
            description="Choose your job category"
            data={[
              { value: "1", label: "Category 1" },
              { value: "2", label: "Category 2" },
            ]}
            {...form.getInputProps("category")}
          />
          <DateInput
            label="Date of Birth"
            placeholder="Select your birth date"
            description="Your date of birth in YYYY-MM-DD format"
            {...form.getInputProps("date_of_birth")}
          />
          <Select
            label="Gender"
            placeholder="Select your gender"
            description="Choose your gender identity"
            data={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
            {...form.getInputProps("gender")}
          />
        </SimpleGrid>

        <Stack gap={0}>
          <TextInput
            label="Nationality"
            placeholder="e.g. Nepalese"
            description="Enter your country of citizenship"
            {...form.getInputProps("nationality")}
            styles={styles.top}
            leftSection={
              <Text size="xs" fw={800}>
                EN
              </Text>
            }
          />
          <TextInput
            disabled={form.getValues().enable_translate}
            placeholder="e.g. ネパール"
            {...form.getInputProps("jp_nationality")}
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
            label="Current Address"
            placeholder="e.g. 123 Tokyo St, Minato-ku, Tokyo"
            description="Your current physical address in English & Japanese"
            {...form.getInputProps("current_address")}
            styles={styles.top}
            leftSection={
              <Text size="xs" fw={800}>
                EN
              </Text>
            }
          />
          <TextInput
            disabled={form.getValues().enable_translate}
            placeholder="例：東京都港区東京通り123番地"
            {...form.getInputProps("jp_current_address")}
            styles={styles.bot}
            leftSection={
              <Text size="xs" fw={800}>
                JP
              </Text>
            }
          />
        </Stack>

        <TextInput
          label="Contact Number"
          placeholder="e.g. +977 9813512312"
          description="Phone number of the person."
          {...form.getInputProps("contact")}
        />

        <Divider />

        <div>
          <Text size="2rem" lh="2.3rem">
            <b>Socials</b>
            <br />
          </Text>
          <Text size="xs">Link your socials across different platform.</Text>
        </div>

        <SimpleGrid cols={{ base: 2, lg: 3 }} spacing="xs">
          <TextInput
            leftSection={<InstagramLogoIcon />}
            label="Instagram Handle"
            placeholder="e.g. instagram url"
            {...form.getInputProps("instagram_url")}
          />
          <TextInput
            leftSection={<FacebookLogoIcon />}
            label="Facebook Handle"
            placeholder="e.g. facebook url"
            {...form.getInputProps("facebook_url")}
          />
          <TextInput
            leftSection={<LinkedinLogoIcon />}
            label="LinkedIn Handle"
            placeholder="e.g. linkedin url"
            {...form.getInputProps("linkedin_url")}
          />
        </SimpleGrid>
      </Stack>
    </>
  );
}
