"use client";

import React, { useEffect, useState } from "react";
//mantine
import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Grid,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
//context
import { FormHandler } from "@/components/framework/FormHandler";

//dates
import moment from "moment";
import { randomId } from "@mantine/hooks";
import { Calculator, Minus, Plus, Warning } from "@phosphor-icons/react";
import { triggerNotification } from "@/components/helper/notification";
import { modals } from "@mantine/modals";

//@ts-ignore , Dates

export function FormBankStatement() {
  //  * DEFINITIONS

  const form = FormHandler.useForm();

  // * CONTEXT

  // * STATES

  const [intrestStartIndex, setIntrestStartIndex] = useState(0);
  const [pastIntrestStartIndex, setPastIntrestStartIndex] = useState<number[]>(
    []
  );

  const [intrestRate, setIntrestRate] = useState(0);
  const [intrestDate, setIntrestDate] = useState(new Date());
  const [taxRate, setTaxRate] = useState(0);

  useEffect(() => {
    console.log(form.values, form.values.intrestStartIndex);
    setIntrestStartIndex(form.values.intrestStartIndex || 0);
    setPastIntrestStartIndex(form.values.pastIntrestStartIndex || []);
  }, []);

  // * PRELOADING

  // * FUNCTIONS

  function roundHalfToEven(num: any) {
    const factor = Math.pow(10, 2);
    return Math.round(num * factor) / factor;
  }

  const calculateBalance = (id: number) => {
    let balance = form.values.statements_opening_bal;

    for (const [index, item] of form.values.statements
      .slice(0, id + 1)
      .entries()) {
      balance += item.credit - item.debit;
    }

    return balance;
  };

  const calculateDebit = (id: number) => {
    let debit = 0;
    for (const [index, item] of form.values.statements
      .slice(0, id + 1)
      .entries()) {
      debit += item.debit || 0;
    }

    return debit;
  };

  const calculateCredit = (id: number) => {
    let credit = 0;

    for (const [index, item] of form.values.statements
      .slice(0, id + 1)
      .entries()) {
      credit += item.credit || 0;
    }

    return credit;
  };

  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: (
        <Group>
          <ActionIcon size="sm" color="red" variant="light">
            <Warning size={12} />
          </ActionIcon>
          <Text
            size="sm"
            style={{
              fontWeight: 600,
            }}
          >
            Please confirm your action
          </Text>
        </Group>
      ),
      children: (
        <Text size="xs" my="md">
          This action cannot be reverted.{" "}
          <span style={{ fontWeight: 600 }}>
            Are you sure you want to proceed?
          </span>
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red", size: "xs" },
      cancelProps: { size: "xs" },
      onCancel: () => {},
      onConfirm: () => {
        form.removeListItem("statements", id);
      },
      styles: { header: { background: "var(--mantine-color-red-light)" } },
      size: "sm",
    });
  };

  const handleDeleteInterest = (id: number) => {
    modals.openConfirmModal({
      title: (
        <Group>
          <ActionIcon size="sm" color="red" variant="light">
            <Warning size={12} />
          </ActionIcon>
          <Text
            size="sm"
            style={{
              fontWeight: 600,
            }}
          >
            Please confirm your action
          </Text>
        </Group>
      ),
      children: (
        <Text size="xs" my="md">
          This action cannot be reverted.{" "}
          <span style={{ fontWeight: 600 }}>
            Are you sure you want to retvert intrest & tax calculations?
          </span>
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red", size: "xs" },
      cancelProps: { size: "xs" },
      onCancel: () => {},
      onConfirm: () => {
        form.setFieldValue("statements", form.values.statements.slice(0, -2));
        form.setFieldValue(
          "pastIntrestStartIndex",
          pastIntrestStartIndex.slice(0, -1)
        );
        form.setFieldValue(
          "intrestStartIndex",
          pastIntrestStartIndex.slice(-1)[0]
        );

        setIntrestStartIndex(pastIntrestStartIndex.slice(-1)[0]);
        setPastIntrestStartIndex(pastIntrestStartIndex.slice(0, -1));
      },
      styles: { header: { background: "var(--mantine-color-red-1)" } },
      size: "sm",
    });
  };

  const handleCalculations = async () => {
    triggerNotification.Form.isLoading({
      message: "Performing Calculations ...",
    });

    try {
      const calculateFirstItem = () => {
        if (intrestStartIndex == 0) {
          return {
            date: form.values.statements_opening_date,
            balance: roundHalfToEven(form.values.statements_opening_bal),
          };
        } else {
          const _item = form.values.statements[intrestStartIndex - 1];

          return {
            ..._item,
            balance: roundHalfToEven(calculateBalance(intrestStartIndex - 1)),
          };
        }
      };

      const itemsOfIntrest = form.values.statements
        .slice(intrestStartIndex, form.values.statements.length)
        .map((item: any, index: number) => {
          return {
            ...item,
            balance: roundHalfToEven(
              calculateBalance(index + intrestStartIndex)
            ),
          };
        });

      const calculateLastItem = () => {
        const balance = roundHalfToEven(
          calculateBalance(intrestStartIndex + itemsOfIntrest.length)
        );

        return {
          balance,
          date: intrestDate,
        };
      };

      const _dataToCalculate = [
        calculateFirstItem(),
        ...itemsOfIntrest,
        calculateLastItem(),
      ];

      console.log(_dataToCalculate);

      const _dataToOperate = _dataToCalculate
        .slice(0, _dataToCalculate.length - 1)
        .map((item: any, index) => {
          const startDate = new Date(item.date);
          const endDate = new Date(_dataToCalculate[index + 1].date);
          //setting time
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          // Calculate the difference in days
          const days = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
          );

          return {
            balance: item.balance,
            days,
            calculatedIntrest: Number(
              item.balance * (intrestRate / 100 / 365) * days
            ),
          };
        });

      console.log(_dataToOperate);

      let _acquiredIntrest = 0;

      for (let index = 0; index < _dataToOperate.length; index++) {
        const item = _dataToOperate[index];
        _acquiredIntrest = Number(_acquiredIntrest + item.calculatedIntrest);
      }

      console.log(_acquiredIntrest);

      form.insertListItem("statements", {
        date: intrestDate,
        description: "Interest",
        credit: roundHalfToEven(Number(_acquiredIntrest)),
        debit: 0,
        code: "INT",
        cheque: "",
        key: randomId(),
        highlight: true,
      });

      form.insertListItem("statements", {
        date: intrestDate,
        description: "Tax Deduction",
        credit: 0,
        debit: Number((_acquiredIntrest * (taxRate / 100)).toFixed(2)),
        code: "TAX",
        cheque: "",
        key: randomId(),
        highlight: true,
      });

      form.setFieldValue("pastIntrestStartIndex", [
        ...pastIntrestStartIndex,
        intrestStartIndex,
      ]);

      setPastIntrestStartIndex([...pastIntrestStartIndex, intrestStartIndex]);
      setIntrestStartIndex(intrestStartIndex + itemsOfIntrest.length + 2);

      form.setFieldValue(
        "intrestStartIndex",
        intrestStartIndex + itemsOfIntrest.length + 2
      );

      triggerNotification.Form.isSuccess({
        message: "Calculations complete",
      });
    } catch (err) {
      triggerNotification.Form.isValidationError({
        message: "The form has invalid/missing fields.",
      });
    }
  };

  // * COMPONENTS

  // * MISC
  const tableInputStyle = {
    input: {
      background: "none",
      border: "none",
      fontSize: "var(--mantine-font-size-xs)",
    },
  };

  return (
    <Container size="lg">
      <Paper withBorder px="md" py="lg">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="xs" fw={600} tt="uppercase">
              Statements
            </Text>

            <Group>
              <Checkbox
                size="xs"
                label="Code"
                {...form.getInputProps("statements_has_code")}
              />
              <Checkbox
                size="xs"
                label="Cheque No."
                {...form.getInputProps("statements_has_cheque")}
              />

              <Button
                onClick={() =>
                  form.insertListItem("statements", {
                    date: "",
                    description: "",
                    credit: 0,
                    debit: 0,
                    code: "",
                    cheque: 0,
                    key: randomId(),
                  })
                }
                size="xs"
                variant="light"
                leftSection={<Plus />}
              >
                Add Entry
              </Button>
            </Group>
          </Group>

          <Table
            withColumnBorders
            withTableBorder
            verticalSpacing={0}
            horizontalSpacing={0}
            styles={{
              th: {
                fontSize: "var(--mantine-font-size-xs)",
                padding: "var(--mantine-spacing-xs) var(--mantine-spacing-sm)",
              },
            }}
          >
            <Table.Thead style={{ background: "var(--mantine-color-gray-0)" }}>
              <Table.Tr>
                <Table.Th w={100}>Date</Table.Th>
                <Table.Th w={350}>Description</Table.Th>

                {form.values.statements_has_code && (
                  <Table.Th w={50}>Code</Table.Th>
                )}
                {form.values.statements_has_cheque && (
                  <Table.Th w={100}>Cheque No.</Table.Th>
                )}

                <Table.Th w={150}>Debit</Table.Th>
                <Table.Th w={150}>Credit</Table.Th>
                <Table.Th w={150}>Balance</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>
                  <DateInput
                    valueFormat="YYYY/MM/DD"
                    variant="filled"
                    placeholder="Date"
                    {...form.getInputProps(`statements_opening_date`)}
                    styles={tableInputStyle}
                    bg={!form.values.statements_opening_date ? "red.0" : ""}
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    variant="filled"
                    placeholder="Description"
                    value="Opening Balance"
                    readOnly
                    styles={tableInputStyle}
                  />
                </Table.Td>
                {form.values.statements_has_code && <Table.Td></Table.Td>}
                {form.values.statements_has_cheque && <Table.Td></Table.Td>}

                <Table.Td></Table.Td>

                <Table.Td></Table.Td>
                <Table.Td>
                  <NumberInput
                    hideControls
                    min={0}
                    leftSection={<Text size="xs">Rs.</Text>}
                    variant="filled"
                    placeholder="Balance"
                    {...form.getInputProps(`statements_opening_bal`)}
                    styles={tableInputStyle}
                    bg={!form.values.statements_opening_bal ? "red.0" : ""}
                  />
                </Table.Td>
              </Table.Tr>

              {form.getValues().statements.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Center px="xl" py={64}>
                      <Text size="xs" ta="center">
                        No stements available. Click <b>Add Entry</b> to start
                        adding entries.
                      </Text>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              )}

              {form.getValues().statements.map((item: any, index: number) => (
                <Table.Tr
                  key={index}
                  bg={item.highlight ? "gray.0" : "none"}
                  style={{
                    borderLeft:
                      intrestStartIndex <= index
                        ? "2px solid var(--mantine-color-brand-5)"
                        : "",
                  }}
                >
                  <Table.Td>
                    <DateInput
                      fw={item.highlight ? 700 : undefined}
                      valueFormat="YYYY/MM/DD"
                      variant="filled"
                      placeholder="Date"
                      {...form.getInputProps(`statements.${index}.date`)}
                      bg={!form.values.statements[index].date ? "red.0" : ""}
                      styles={tableInputStyle}
                    />
                  </Table.Td>
                  <Table.Td>
                    <TextInput
                      readOnly={
                        item.description === "Tax Deduction" ||
                        item.description === "Interest"
                      }
                      fw={item.highlight ? 700 : undefined}
                      variant="filled"
                      placeholder="Description"
                      {...form.getInputProps(`statements.${index}.description`)}
                      styles={tableInputStyle}
                    />
                  </Table.Td>
                  {form.values.statements_has_code && (
                    <Table.Td>
                      <TextInput
                        fw={item.highlight ? 700 : undefined}
                        variant="filled"
                        placeholder="Code"
                        {...form.getInputProps(`statements.${index}.code`)}
                        styles={tableInputStyle}
                      />
                    </Table.Td>
                  )}
                  {form.values.statements_has_cheque && (
                    <Table.Td>
                      <TextInput
                        fw={item.highlight ? 700 : undefined}
                        variant="filled"
                        placeholder="Cheque"
                        {...form.getInputProps(`statements.${index}.cheque`)}
                        styles={tableInputStyle}
                      />
                    </Table.Td>
                  )}

                  <Table.Td>
                    <NumberInput
                      fw={item.highlight ? 700 : undefined}
                      hideControls
                      min={0}
                      leftSection={<Text size="xs">Rs.</Text>}
                      variant="filled"
                      placeholder="Debit"
                      {...form.getInputProps(`statements.${index}.debit`)}
                      styles={tableInputStyle}
                    />
                  </Table.Td>

                  <Table.Td>
                    <NumberInput
                      fw={item.highlight ? 700 : undefined}
                      hideControls
                      min={0}
                      leftSection={<Text size="xs">Rs.</Text>}
                      variant="filled"
                      placeholder="Credit"
                      {...form.getInputProps(`statements.${index}.credit`)}
                      styles={tableInputStyle}
                    />
                  </Table.Td>

                  <Table.Td>
                    <NumberInput
                      fw={item.highlight ? 700 : undefined}
                      onKeyDown={(e) => {
                        if (
                          e.code === "Tab" &&
                          index == form.values.statements.length - 1
                        ) {
                          form.insertListItem("statements", {
                            date: "",
                            description: "",
                            credit: 0,
                            debit: 0,
                            code: "",
                            cheque: 0,
                            key: randomId(),
                          });
                        }
                      }}
                      decimalScale={2}
                      hideControls
                      min={0}
                      leftSection={<Text size="xs">Rs.</Text>}
                      variant="filled"
                      placeholder="Balance"
                      value={calculateBalance(index)}
                      styles={tableInputStyle}
                      rightSection={
                        item.description !== "Tax Deduction" && (
                          <ActionIcon
                            disabled={
                              item.description === "Interest" &&
                              form.values.statements.length > index + 2
                            }
                            radius="xl"
                            color="red"
                            variant="light"
                            onClick={() => {
                              if (item.description !== "Interest") {
                                handleDelete(index);
                              } else {
                                handleDeleteInterest(index);
                              }
                            }}
                            size="xs"
                          >
                            <Minus size={10} />
                          </ActionIcon>
                        )
                      }
                    />
                  </Table.Td>
                </Table.Tr>
              ))}

              <Table.Tr style={{}} bg="brand.0">
                <Table.Td colSpan={2}>
                  <Text size="xs" px="sm">
                    Statement Summary
                  </Text>
                </Table.Td>

                {form.values.statements_has_code && <Table.Td></Table.Td>}
                {form.values.statements_has_cheque && <Table.Td></Table.Td>}

                <Table.Td>
                  <NumberInput
                    decimalScale={2}
                    readOnly
                    hideControls
                    min={0}
                    leftSection={<Text size="xs">Rs.</Text>}
                    variant="filled"
                    placeholder="Debit"
                    styles={tableInputStyle}
                    value={calculateDebit(form.values.statements.length)}
                  />
                </Table.Td>

                <Table.Td>
                  <NumberInput
                    decimalScale={2}
                    readOnly
                    hideControls
                    min={0}
                    leftSection={<Text size="xs">Rs.</Text>}
                    variant="filled"
                    placeholder="Credit"
                    value={calculateCredit(form.values.statements.length)}
                    styles={tableInputStyle}
                  />
                </Table.Td>

                <Table.Td>
                  <NumberInput
                    readOnly
                    decimalScale={2}
                    hideControls
                    min={0}
                    leftSection={<Text size="xs">Rs.</Text>}
                    variant="filled"
                    placeholder="Balance"
                    value={calculateBalance(form.values.statements.length)}
                    styles={tableInputStyle}
                  />
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          <Group justify="space-between" gap="xs">
            <Text size="xs">
              Generate Interest & TAX{" "}
              <b>({form.values.statements.length - intrestStartIndex})</b>
            </Text>

            <Group gap="xs">
              <DateInput
                w={130}
                valueFormat="YYYY/MM/DD"
                leftSectionWidth={35}
                rightSectionWidth={20}
                min={0}
                size="xs"
                placeholder="Select Date"
                onChange={(e: any) => {
                  setIntrestDate(e);
                }}
              />

              <NumberInput
                w={130}
                rightSection={<Text size="xs">%</Text>}
                leftSection={<Text size="xs">Int. :</Text>}
                leftSectionWidth={35}
                rightSectionWidth={20}
                hideControls
                min={0}
                size="xs"
                placeholder="00.00"
                onChange={(e: any) => {
                  setIntrestRate(e);
                }}
              />
              <NumberInput
                w={130}
                rightSection={<Text size="xs">%</Text>}
                leftSection={<Text size="xs">Tax :</Text>}
                leftSectionWidth={35}
                rightSectionWidth={20}
                hideControls
                min={0}
                size="xs"
                placeholder="00.00"
                onChange={(e: any) => {
                  setTaxRate(e);
                }}
              />

              <Button
                variant="outline"
                onClick={async () => {
                  handleCalculations();
                }}
                size="xs"
                leftSection={<Calculator />}
                disabled={
                  (form.values.statements.length <= intrestStartIndex &&
                    form.values.statements.length !== 0) ||
                  !intrestDate ||
                  !intrestRate ||
                  !taxRate
                }
              >
                Add Intrest & TAX
              </Button>
            </Group>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
