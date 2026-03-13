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

export function FormWodaGeneral() {
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
              <TextInput
                disabled={form.values.woda_header}
                label="Document Reference No."
                description="Reference No. for Woda Docs"
                placeholder="e.g. xxxx/xx"
                {...form.getInputProps("wodadoc_refno")}
              />
              <DateInput
                valueFormat="YYYY/MM/DD"
                disabled={form.values.woda_header}
                label="Document Date"
                description="Date for Woda Docs"
                placeholder="Select Date"
                {...form.getInputProps("wodadoc_date")}
              />
            </SimpleGrid>
          </SimpleGrid>

          <Divider mt="sm" />

          <Text size="xs" fw={600} tt="uppercase" my="sm">
            Spokesperson Details
          </Text>

          <SimpleGrid cols={2} spacing="xs">
            <TextInput
              label="Spokeperson's Full Name"
              description="Spokeperson's Full Name"
              placeholder="e.g. John Doe"
              {...form.getInputProps("spokesperson_name")}
            />
            <TextInput
              label="Spokeperson's Post"
              description="Spokesperson's Post"
              placeholder="e.g. Ward Chairman"
              {...form.getInputProps("spokesperson_post")}
            />
            <TextInput
              label="Spokeperson's Contact"
              description="Spokesperson's Contact Details"
              placeholder="e.g. 98xxxxxxxx"
              {...form.getInputProps("spokesperson_contact")}
            />
          </SimpleGrid>
        </Stack>
      </Paper>
    </Container>
  );
}
