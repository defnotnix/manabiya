"use client";

import React from "react";
//mantine
import {
  Container,
  Divider,
  Grid,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
//context
import { FormHandler } from "@/components/framework/FormHandler";

//dates
import moment from "moment";

//@ts-ignore , Dates
import adbs from "ad-bs-converter";

export function FormApplicant() {
  // * DEFINITIONS

  const form = FormHandler.useForm();

  // * CONTEXTS

  const {
    current,
    handleSubmit,
    steps,
    stepClickable,
    initialStep,
    handleStepBack,
    handleStepNext,
  } = FormHandler.usePropContext();

  // * STATES

  // * PRELOADS

  // * FUNCTIONS

  // * COMPONENTS

  return (
    <Container size="lg">
      <Paper withBorder px="md" py="lg">
        <Stack gap="xs">
          <Text size="xs" fw={600} tt="uppercase" mb="sm">
            Applicant Details
          </Text>

          <SimpleGrid cols={2} spacing="xs">
            <SimpleGrid cols={2} spacing="xs">
              <Select
                data={["Male", "Female"]}
                label="Applicant Gender"
                description="Applicant Gender"
                placeholder="e.g. Male, Female"
                {...form.getInputProps("applicant_gender")}
              />
              <TextInput
                label="Applicant Honorific"
                description="Applicant Honorifics"
                placeholder="e.g. Mr, Miss, Mrs"
                {...form.getInputProps("applicant_honorific")}
              />
            </SimpleGrid>
            <TextInput
              label="Applicant Name"
              description="Applicant Name"
              placeholder="e.g. John Doe"
              {...form.getInputProps("applicant_name")}
            />
            <TextInput
              label="Address"
              description="Full Permanent Address"
              placeholder="e.g. Thakurbaba Municipality, Ward No 8, Bardiya, Lumbini Province, Nepal"
              {...form.getInputProps("applicant_permanent_address")}
            />

            <SimpleGrid cols={2} spacing="xs">
              <DateInput
                valueFormat="YYYY/MM/DD"
                label="Date of Birth (A.D.)"
                description="Applicant's Date of Birth"
                placeholder="Select Date of Birth"
                {...form.getInputProps("applicant_dob")}
                onChange={(e) => {
                  try {
                    const _edate = moment(e).format("YYYY/MM/DD");

                    const _ndate = adbs.ad2bs(_edate);

                    form.setFieldValue("applicant_dob", new Date(_edate));

                    form.setFieldValue(
                      "applicant_dob_bs",
                      `${_ndate.en.year}/${_ndate.en.month.toLocaleString(
                        "en-US",
                        {
                          minimumIntegerDigits: 2,
                          useGrouping: false,
                        }
                      )}/${_ndate.en.day.toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
                      })}`
                    );
                  } catch (err) {
                    form.setFieldValue("applicant_dob", "");
                  }
                }}
              />
              <TextInput
                readOnly
                label="Date of Birth (B.S.)"
                description="Applicant's Date of Birth"
                placeholder="Select Date of Birth"
                {...form.getInputProps("applicant_dob_bs")}
              />
            </SimpleGrid>

            <TextInput
              label="Birth Address"
              description="Birth Address of the Applicant"
              placeholder="e.g. Geruwa Rural Municipality, Ward No. 1, Bardiya, Lumbini Province, Nepal"
              {...form.getInputProps("applicant_birth_address")}
            />

            <div></div>

            <TextInput
              label="Applicant Citizenship No."
              description="Applicant's Citizenship ID Number"
              placeholder="e.g. xx-xx-xx-xxxx"
              {...form.getInputProps("applicant_citizenship")}
            />

            <TextInput
              label="Applicant Citizenship Issuer"
              description="Citizenship Issuer for the applicant"
              placeholder="e.g. District Administration Office, Bardiya"
              {...form.getInputProps("applicant_citizenship_issuer")}
            />
          </SimpleGrid>

          <Divider mt="sm" />

          <Text size="xs" fw={600} tt="uppercase" my="sm">
            Guardian Details
          </Text>

          <Grid gutter="xs">
            <Grid.Col span={2}>
              <Select
                label="Father's Honorific"
                description="Mr/Late"
                placeholder="e.g. Mr."
                data={["Mr.", "Late"]}
                {...form.getInputProps("applicant_father_honorific")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Father's Name"
                description="Applicant's Father's Name"
                placeholder="e.g. John Doe"
                leftSectionWidth={200}
                {...form.getInputProps("applicant_father_name")}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <Select
                label="Mother's Honorific"
                description="Mrs/Late"
                placeholder="e.g. Mrs."
                data={["Mrs.", "Late"]}
                {...form.getInputProps("applicant_mother_honorific")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Mother's Name"
                description="Applicant's Mother's Name"
                placeholder="e.g. John Doe"
                leftSectionWidth={200}
                {...form.getInputProps("applicant_mother_name")}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Paper>
    </Container>
  );
}
