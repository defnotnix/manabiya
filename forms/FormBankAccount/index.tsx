"use client";

import React from "react";
//mantine
import {
  Container,
  Divider,
  Grid,
  NumberInput,
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

export function FormBankAccount() {
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
            Account Details
          </Text>

          <SimpleGrid spacing="xs" cols={4}>
            <TextInput
              label="Reference No. CERT.."
              description="Bank account reference no."
              placeholder="e.g. SSCS-080-56786"
              {...form.getInputProps("statement_ref_no")}
            />
            <TextInput
              label="Reference No STMT."
              description="Bank account reference no."
              placeholder="e.g. SSCS-080-56786"
              {...form.getInputProps("statement_ref_no_statement")}
            />

            <TextInput
              label="Account No."
              description="Bank account number"
              placeholder="e.g. GS-011-172153"
              {...form.getInputProps("statement_account_no")}
            />
            <TextInput
              label="Member ID"
              description="Unique member identification number"
              placeholder="e.g. 05-5144"
              {...form.getInputProps("statement_member_id")}
            />
          </SimpleGrid>

          <SimpleGrid spacing="xs" cols={2}>
            <TextInput
              label="Account Holder"
              description="Name of the account holder"
              placeholder="e.g. Mr. Shree Narayan Rajbanshi"
              {...form.getInputProps("statement_account_holder")}
            />
            <TextInput
              label="Account Holder's Address"
              description="Address of the account holder"
              placeholder="e.g. Gauriganj Rural Municipality Ward No. 1, Jhapa, Koshi Province, Nepal"
              {...form.getInputProps("statement_account_address")}
            />
            <TextInput
              label="Account Type"
              description="Type of the bank account"
              placeholder="e.g. General Saving"
              {...form.getInputProps("statement_account_type")}
            />
            <TextInput
              label="Account Status"
              description="Current status of the account"
              placeholder="e.g. Running"
              {...form.getInputProps("statement_account_status")}
            />
          </SimpleGrid>

          <Divider mt="sm" />

          <Text size="xs" fw={600} tt="uppercase" my="sm">
            Statement Details
          </Text>

          <SimpleGrid spacing="xs" cols={4}>
            <DateInput
              label="Statement Start Date"
              description="Start date of the statement period"
              placeholder="e.g. 13/09/2022"
              {...form.getInputProps("statement_start_date")}
              value={new Date(form.values.statement_start_date)}
            />
            <DateInput
              label="Statement End Date"
              description="End date of the statement period"
              placeholder="e.g. 13/09/2023"
              {...form.getInputProps("statement_end_date")}
              value={new Date(form.values.statement_end_date)}
            />

            <Select
              data={["Monthly", "Quaterly", "Yearly"]}
              label="Interest Calculation Type"
              description="Type of interest calculation"
              placeholder="e.g. Monthly"
              {...form.getInputProps("statement_interest_calculation")}
            />
          </SimpleGrid>

          <SimpleGrid spacing="xs" cols={4}>
            <NumberInput
              hideControls
              min={0}
              label="Written TAX"
              description="Declared tax amount"
              placeholder="e.g. 6.0"
              {...form.getInputProps("statement_tax")}
            />
            <NumberInput
              hideControls
              min={0}
              label="Written Interest"
              description="Declared interest rate"
              placeholder="e.g. 6.5"
              {...form.getInputProps("statement_interest")}
            />

            <TextInput
              label="Interest Method"
              description="Method of Interest Calculation"
              placeholder="e.g. Daily Balance Method"
              {...form.getInputProps("statement_interest_method")}
            />

            <TextInput
              label="Interest Post"
              description="Duration of Interest Calculation"
              placeholder="e.g. Monthly, Quaterly, Yearly"
              {...form.getInputProps("statement_interest_post")}
            />
          </SimpleGrid>

          <Text size="xs" fw={600} tt="uppercase" my="sm">
            Conversions
          </Text>

          <SimpleGrid spacing="xs" cols={4}>
            <NumberInput
              hideControls
              min={0}
              label="Opening Balance"
              description="Opening balance of the account"
              placeholder="e.g. 1278492.18"
              {...form.getInputProps("statement_opening_balance")}
              onChange={(e) => {
                form.setFieldValue("statement_opening_balance", e);
                form.setFieldValue("statements_opening_bal", e);
              }}
            />
            <NumberInput
              hideControls
              min={0}
              label="USD Rate"
              description="NPR equivalent per 1 USD"
              placeholder="e.g. 133.53"
              {...form.getInputProps("statement_usdrate")}
              onChange={(e: number) => {
                form.setFieldValue("statement_usdrate", e);
                form.setFieldValue(
                  "statement_usdrate_equiv",
                  (Number(form.values.statements_opening_bal) / e).toFixed(2)
                );
              }}
            />
            <NumberInput
              readOnly
              hideControls
              min={0}
              label="USD Equivalent"
              description="NPR equivalent per 1 USD"
              placeholder="e.g. 133.53"
              {...form.getInputProps("statement_usdrate_equiv")}
            />
          </SimpleGrid>

          <SimpleGrid spacing="xs" cols={2}>
            <TextInput
              hideControls
              min={0}
              label="NPR Balance in words"
              description="e.g. NPR Three Million Ninety Seven ...."
              placeholder="Enter NPR Balance in words"
              {...form.getInputProps("statement_total_balance_words")}
            />
            <TextInput
              hideControls
              min={0}
              label="USD Balance in words"
              description="e.g. USD Three Million Ninety Seven ...."
              placeholder="Enter USD Balance in words"
              {...form.getInputProps("statement_total_balance_words_usd")}
            />
          </SimpleGrid>

          <Text size="xs" fw={600} tt="uppercase" my="sm">
            Spokesperson
          </Text>

          <SimpleGrid spacing="xs" cols={2}>
            <TextInput
              hideControls
              min={0}
              label="Spokesperson Name"
              description="e.g. Bibisha Shrestha"
              placeholder="Someone who signs the document"
              {...form.getInputProps("statement_spokesperson")}
            />
            <TextInput
              hideControls
              min={0}
              label="Spokesperson Post"
              description="e.g. Bibisha Shrestha"
              placeholder="Post of the spokesperson"
              {...form.getInputProps("statement_spokesperson_post")}
            />
          </SimpleGrid>
        </Stack>
      </Paper>
    </Container>
  );
}
