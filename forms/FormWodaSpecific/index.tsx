"use client";

import React, { useContext, useEffect, useState } from "react";
//mantine
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
//context
import { FormHandler } from "@/components/framework/FormHandler";

//dates
import moment from "moment";
import { ContextEditor } from "@/components/layout/editor/editor.context";
import { Plus, Trash } from "@phosphor-icons/react";
import { useDisclosure } from "@mantine/hooks";
//@ts-ignore , Dates
import adbs from "ad-bs-converter";

export function FormWodaSpecific() {
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

  const { state, dispatch } = useContext(ContextEditor.Context);

  // * STATES

  const data = state.signatures || [];

  // * PRELOADS

  // * FUNCTIONS

  function openSignatureDrawer(template: string, templateField: string = "") {
    dispatch({
      type: "SHOW_SIGNATURE",
      payload: {
        template,
        field: templateField,
      },
    });
  }

  function onSignatureSelect(res: any) {}

  // * COMPONENTS

  return (
    <Container size="lg">
      <Paper withBorder>
        <Tabs
          keepMounted={false}
          defaultValue={"1"}
          onChange={(e) => {
            dispatch({
              type: "UPDATE_SIGNATURE_WODA_TAB",
              payload: e,
            });
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="1">
              <Text size="xs" fw={600}>
                Relationship
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="2">
              <Text size="xs" fw={600}>
                Fiscal
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="3">
              <Text size="xs" fw={600}>
                Occupation
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="4">
              <Text size="xs" fw={600}>
                Date of Birth
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="5">
              <Text size="xs" fw={600}>
                Annual Income
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="6">
              <Text size="xs" fw={600}>
                TAX Clearance
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="7">
              <Text size="xs" fw={600}>
                Migration
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="8">
              <Text size="xs" fw={600}>
                Surname
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="9">
              <Text size="xs" fw={600}>
                Address
              </Text>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="1">
            <Stack gap="xs" p="md">
              <Group justify="space-between" mb="sm">
                <Text size="xs" fw={600} tt="uppercase" py="6px">
                  Relationship Verification Certificate
                </Text>
              </Group>

              <Stack gap={0}>
                <Textarea
                  rows={6}
                  placeholder="e.g. Local Government Operation
Act, 2017 A.D. (2074 B.S.), Chapter (3) Section (12) Sub-Section (2)
Clause (E) 1."
                  {...form.getInputProps("signature_issued_act_relationship")}
                />

                <Button
                  leftSection={<Plus />}
                  size="xs"
                  variant="light"
                  onClick={() =>
                    openSignatureDrawer(
                      "relationship_verification",
                      "signature_issued_act_relationship"
                    )
                  }
                >
                  Select Signature
                </Button>
              </Stack>

              <Divider my="md" />

              <Group mb="sm">
                <Switch
                  checked={form.values?.extra_relation}
                  {...form.getInputProps("extra_relation")}
                />
                <Text size="xs" fw={600} tt="uppercase" py="6px">
                  Extra Personnel
                </Text>
              </Group>

              <SimpleGrid cols={3} spacing="xs">
                <TextInput
                  disabled={!form.values?.extra_relation}
                  label="Extra Person - Honorific"
                  description="Mr / Mrs / Miss"
                  placeholder="e.g. Mr."
                  {...form.getInputProps("relation_extra_honorific")}
                />
                <TextInput
                  disabled={!form.values?.extra_relation}
                  label="Extra Person - Full Name"
                  description="e.g. Ramesh Govind"
                  placeholder="e.g. Ramesh Govind"
                  withAsterisk
                  style={{ flex: 1 }}
                  key={form.key(`fiscal_1_bs`)}
                  {...form.getInputProps(`relation_extra_name`)}
                />
                <TextInput
                  disabled={!form.values?.extra_relation}
                  label="Extra Person - Relation"
                  description="e.g. e.g. Applicant's Brother"
                  placeholder="e.g. Applicant's Brother"
                  withAsterisk
                  style={{ flex: 1 }}
                  key={form.key(`fiscal_1_ad`)}
                  {...form.getInputProps(`relation_extra_relation`)}
                />
              </SimpleGrid>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="2">
            <Stack gap="xs" p="md">
              <Group justify="space-between" mb="sm">
                <Text size="xs" fw={600} tt="uppercase">
                  Fiscal Year - Year 1
                </Text>
              </Group>

              <SimpleGrid cols={2} spacing="xs">
                <TextInput
                  placeholder="e.g. 2079/2080"
                  withAsterisk
                  style={{ flex: 1 }}
                  key={form.key(`fiscal_1_bs`)}
                  {...form.getInputProps(`fiscal_1_bs`)}
                />
                <TextInput
                  placeholder="e.g. 2022/2023"
                  withAsterisk
                  style={{ flex: 1 }}
                  key={form.key(`fiscal_1_ad`)}
                  {...form.getInputProps(`fiscal_1_ad`)}
                />
              </SimpleGrid>
              <Stack gap={0}>
                <Textarea
                  rows={3}
                  placeholder="Select Template"
                  withAsterisk
                  style={{ flex: 1 }}
                  key={form.key(`fiscal_1_full`)}
                  {...form.getInputProps(`fiscal_fullfiscal_1`)}
                />
                <Button
                  leftSection={<Plus />}
                  size="xs"
                  variant="light"
                  onClick={() =>
                    openSignatureDrawer("fiscal_full", "fiscal_fullfiscal_1")
                  }
                >
                  Select Signature
                </Button>
              </Stack>

              <Divider my="md" />

              <Group justify="space-between" mb="sm">
                <Text size="xs" fw={600} tt="uppercase">
                  Fiscal Year - Year 2
                </Text>
              </Group>

              <SimpleGrid cols={2} spacing="xs">
                <TextInput
                  placeholder="e.g. 2079/2080"
                  withAsterisk
                  style={{ flex: 1 }}
                  key={form.key(`fiscal_2_bs`)}
                  {...form.getInputProps(`fiscal_2_bs`)}
                />
                <TextInput
                  placeholder="e.g. 2022/2023"
                  withAsterisk
                  style={{ flex: 1 }}
                  key={form.key(`fiscal_2_ad`)}
                  {...form.getInputProps(`fiscal_2_ad`)}
                />
              </SimpleGrid>
              <Stack gap={0}>
                <Textarea
                  rows={3}
                  placeholder="Select Template"
                  withAsterisk
                  style={{ flex: 1 }}
                  key={form.key(`fiscal_2_full`)}
                  {...form.getInputProps(`fiscal_fullfiscal_2`)}
                />
                <Button
                  leftSection={<Plus />}
                  size="xs"
                  variant="light"
                  onClick={() =>
                    openSignatureDrawer("fiscal_full", "fiscal_fullfiscal_2")
                  }
                >
                  Select Signature
                </Button>
              </Stack>

              <Divider my="md" />

              <Group justify="space-between" mb="sm">
                <Text size="xs" fw={600} tt="uppercase">
                  Fiscal Year - Year 3
                </Text>
              </Group>

              <SimpleGrid cols={2} spacing="xs">
                <TextInput
                  placeholder="e.g. 2079/2080"
                  withAsterisk
                  style={{ flex: 1 }}
                  key={form.key(`fiscal_3_bs`)}
                  {...form.getInputProps(`fiscal_3_bs`)}
                />
                <TextInput
                  placeholder="e.g. 2022/2023"
                  withAsterisk
                  style={{ flex: 1 }}
                  key={form.key(`fiscal_3_ad`)}
                  {...form.getInputProps(`fiscal_3_ad`)}
                />
              </SimpleGrid>
              <Stack gap={0}>
                <Textarea
                  rows={3}
                  placeholder="Select Template"
                  withAsterisk
                  style={{ flex: 1 }}
                  key={form.key(`fiscal_3_full`)}
                  {...form.getInputProps(`fiscal_fullfiscal_3`)}
                />
                <Button
                  leftSection={<Plus />}
                  size="xs"
                  variant="light"
                  onClick={() =>
                    openSignatureDrawer("fiscal_full", "fiscal_fullfiscal_3")
                  }
                >
                  Select Signature
                </Button>
              </Stack>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="3">
            <Stack gap="xs" p="md">
              <Group justify="space-between">
                <Text size="xs" fw={600} tt="uppercase" pt="6px">
                  EARNING GUARDIAN
                </Text>
              </Group>
              <SimpleGrid cols={2} spacing="xs">
                <Select
                  label="Earning Guardian"
                  description="Applicant's Earning Guardian"
                  placeholder="Select Guardian"
                  data={[
                    { value: "father", label: "Father" },
                    { value: "mother", label: "Mother" },
                  ]}
                  {...form.getInputProps("applicant_earning_guardian")}
                />
              </SimpleGrid>

              <Divider mt="sm" />
              <Group justify="space-between" my="sm">
                <Text size="xs" fw={600} tt="uppercase">
                  OCCUPATIONS
                </Text>

                <Button
                  leftSection={<Plus />}
                  size="xs"
                  variant="light"
                  onClick={() => {
                    form.insertListItem("occupations", {
                      name: "",
                      income1: 0,
                      income2: 0,
                      income3: 0,
                    });
                  }}
                >
                  Add Occupation
                </Button>
              </Group>

              <Grid gutter="xs" opacity={0.5} py="sm">
                <Grid.Col span={5}>
                  <Text size="10px" tt="uppercase" fw={600}>
                    Occupation Name
                  </Text>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Text size="10px" tt="uppercase" fw={600}>
                    Earning Y1
                  </Text>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Text size="10px" tt="uppercase" fw={600}>
                    Earning Y2
                  </Text>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Text size="10px" tt="uppercase" fw={600}>
                    Earning Y3
                  </Text>
                </Grid.Col>
              </Grid>

              {form.getValues().occupations.map((item: any, index: number) => (
                <Grid key={index} gutter="xs">
                  <Grid.Col span={5}>
                    <TextInput
                      placeholder="Occupation Name"
                      withAsterisk
                      style={{ flex: 1 }}
                      key={form.key(`employees.${index}.name`)}
                      {...form.getInputProps(`occupations.${index}.name`)}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <NumberInput
                      min={0}
                      hideControls
                      {...form.getInputProps(`occupations.${index}.income1`)}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <NumberInput
                      min={0}
                      hideControls
                      {...form.getInputProps(`occupations.${index}.income2`)}
                      s
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <NumberInput
                      min={0}
                      hideControls
                      {...form.getInputProps(`occupations.${index}.income3`)}
                    />
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <Group justify="flex-end">
                      <ActionIcon
                        color="red"
                        variant="light"
                        size="lg"
                        onClick={() => {
                          form.removeListItem("occupations", index);
                        }}
                      >
                        <Trash />
                      </ActionIcon>
                    </Group>
                  </Grid.Col>
                </Grid>
              ))}

              <Divider mt="sm" />
              <Group justify="space-between" my="sm">
                <Text size="xs" fw={600} tt="uppercase">
                  End Note
                </Text>
              </Group>

              <Stack gap={0}>
                <Textarea
                  rows={6}
                  placeholder="e.g. Local Government Operation
          Act, 2017 A.D. (2074 B.S.), Chapter (3) Section (12) Sub-Section (2)
          Clause (E) 1."
                  {...form.getInputProps("occupation_note")}
                />

                <Button
                  leftSection={<Plus />}
                  size="xs"
                  variant="light"
                  onClick={() =>
                    openSignatureDrawer(
                      "occupation_verification",
                      "occupation_note"
                    )
                  }
                >
                  Select Signature
                </Button>
              </Stack>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="4">
            <Stack gap="xs" p="md">
              <Group justify="space-between" mb="sm">
                <Text size="xs" fw={600} tt="uppercase" py="6px">
                  Date of Birth Verification Certificate
                </Text>
              </Group>

              <Stack gap={0}>
                <Textarea
                  rows={6}
                  placeholder="e.g. Local Government Operation
          Act, 2017 A.D. (2074 B.S.), Chapter (3) Section (12) Sub-Section (2)
          Clause (E) 1."
                  {...form.getInputProps("signature_issued_act_dob")}
                />

                <Button
                  leftSection={<Plus />}
                  size="xs"
                  variant="light"
                  onClick={() =>
                    openSignatureDrawer(
                      "dob_verification",
                      "signature_issued_act_dob"
                    )
                  }
                >
                  Select Signature
                </Button>
              </Stack>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="5">
            <Stack gap="xs" p="md">
              <Group justify="space-between" mb="sm">
                <Text size="xs" fw={600} tt="uppercase" py="6px">
                  Annual Income Verification Certificate
                </Text>
              </Group>

              <Stack gap={0}>
                <SimpleGrid cols={2} spacing="xs">
                  <NumberInput
                    min={1}
                    hideControls
                    label="USD Coversion Rate"
                    description="Value of 1USD in NRs."
                    placeholder="e.g. 133.58"
                    {...form.getInputProps("usd_rate")}
                  />
                  <DateInput
                    label="Conversion Rate Date"
                    description="Date of the given Conversion Rate"
                    placeholder="Select Date"
                    {...form.getInputProps("rate_date")}
                  />
                </SimpleGrid>
              </Stack>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="6">
            <Stack gap="xs" p="md">
              <Group justify="space-between">
                <Text size="xs" fw={600} tt="uppercase" pt="6px">
                  TAX Clearance Certificate
                </Text>
              </Group>
              <SimpleGrid cols={2} spacing="xs" mt="md">
                <NumberInput
                  min={0}
                  hideControls
                  label="TAX Rate"
                  description="TAX Rate for the occupations, 0 for none"
                  placeholder="e.g. 133.58"
                  {...form.getInputProps("tax")}
                />
                <TextInput
                  label="TAX Clearance Issuer"
                  description="Body/Org giving this Clearance Doc"
                  placeholder="e.g. Thakurba Municipality"
                  {...form.getInputProps("tax_clearance_issuer")}
                />
              </SimpleGrid>

              <Divider mt="sm" />
              <Group justify="space-between" my="sm">
                <Text size="xs" fw={600} tt="uppercase">
                  TAX Clearance Signature
                </Text>
              </Group>

              <Stack gap={0}>
                <Textarea
                  rows={6}
                  placeholder="e.g. According to the Nepal Government Income Tax Act 2058 B.S. (2002 A.D.) Chapter 4 (11) (2) (1), (sources: www.lawcommission.gov.np, www.ird.gov.np) taxes have been exempted for Incomes from Agriculture which includes Agriculture Products (Rice, Wheat and Millet), Poultry and Pig Farm and Litchi and Grape Farming. Hence, there is no any outstanding tax to be paid in this office."
                  {...form.getInputProps("signature_tax")}
                />
                <Button
                  leftSection={<Plus />}
                  size="xs"
                  variant="light"
                  onClick={() =>
                    openSignatureDrawer("tax_clearance", "signature_tax")
                  }
                >
                  Select Signature
                </Button>
              </Stack>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="7">
            <Stack gap="xs" p="md">
              <Group justify="space-between" mb="sm">
                <Text size="xs" fw={600} tt="uppercase" py="6px">
                  Migration Certificate
                </Text>
              </Group>
              <SimpleGrid cols={2} spacing="xs">
                <TextInput
                  label="Initial Address"
                  description="Initial Address of the Applicant"
                  placeholder="e.g. Bannatoli Village Development Committee Ward No. 9"
                  {...form.getInputProps("initial_address")}
                />
                <DateInput
                  label="Migration Date"
                  description="Date of Migration"
                  placeholder="Select Date"
                  {...form.getInputProps("migration_date")}
                />
              </SimpleGrid>

              <Divider mt="sm" />
              <Group justify="space-between" my="sm">
                <Text size="xs" fw={600} tt="uppercase">
                  Migration Signature
                </Text>
              </Group>

              <Text size="xs">Signature for : along with ...</Text>

              <Textarea
                rows={6}
                placeholder="e.g. along with her parent"
                {...form.getInputProps("signature_migration_alongwith")}
              />

              <Button
                leftSection={<Plus />}
                size="xs"
                variant="light"
                onClick={() =>
                  openSignatureDrawer(
                    "migration",
                    "signature_migration_alongwith"
                  )
                }
              >
                Select Signature
              </Button>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="8">
            <Stack gap="xs" p="md">
              <Group justify="space-between" mb="sm">
                <Text size="xs" fw={600} tt="uppercase" py="6px">
                  Surname Verification
                </Text>
              </Group>

              <SimpleGrid cols={2} spacing="xs">
                <TextInput
                  label="Surname compared with"
                  description={`e.g.is dissimilar to  .....`}
                  placeholder="e.g. her and her parent's surnames"
                  {...form.getInputProps("applicant_surname_reference")}
                />
                <SimpleGrid cols={2} spacing="xs">
                  <TextInput
                    label="Parent's Surname"
                    description="e.g. Thapa Magar"
                    placeholder="e.g. Thapa Magar"
                    {...form.getInputProps("applicant_parents_surname")}
                  />
                  <TextInput
                    label="Applicant's Surname"
                    description="e.g. Thapa"
                    placeholder="e.g. Thapa"
                    {...form.getInputProps("applicant_surname")}
                  />
                </SimpleGrid>
              </SimpleGrid>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="9">
            <Stack gap="xs" p="md">
              <Group justify="space-between" mb="sm">
                <Text size="xs" fw={600} tt="uppercase" py="6px">
                  Permanent Address Certificate
                </Text>
              </Group>

              <SimpleGrid cols={2} spacing="xs">
                <TextInput
                  label="Initial Address Name"
                  description="Initial name of the permanent address"
                  placeholder="e.g. Bannatoli Village Development Committee Ward No. 9"
                  {...form.getInputProps("initial_address_name")}
                />
                <SimpleGrid cols={2} spacing="xs">
                  <DateInput
                    label="Address Name Change Date"
                    description="Enter address name change date"
                    placeholder="Select Date"
                    {...form.getInputProps("address_name_change_date")}
                    onChange={(e) => {
                      try {
                        const _edate = moment(e).format("YYYY/MM/DD");

                        const _ndate = adbs.ad2bs(_edate);

                        form.setFieldValue(
                          "address_name_change_date",
                          new Date(_edate)
                        );

                        form.setFieldValue(
                          "address_name_change_date_bs",
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
                        form.setFieldValue("address_name_change_date", "");
                      }
                    }}
                  />
                  <TextInput
                    readOnly
                    label="Date of Birth (B.S.)"
                    description="Applicant's Date of Birth"
                    placeholder="Select Date of Birth"
                    {...form.getInputProps("address_name_change_date_bs")}
                  />
                </SimpleGrid>
              </SimpleGrid>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}
