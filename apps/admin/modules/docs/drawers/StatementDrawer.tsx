"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  Stack,
  TextInput,
  Select,
  Button,
  Group,
  Container,
  Paper,
  Divider,
  NumberInput,
  ActionIcon,
  Table,
  Center,
  Text,
  Checkbox,
  SimpleGrid,
  Radio,
  Loader,
  Modal,
  Textarea,
  Box,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Plus, Minus, Calculator, Warning } from "@phosphor-icons/react";
import { useDocContext, BANK_KEY_LABELS, BankStatementData } from "@/context/DocumentContext";
import { randomId } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { moduleApiCall } from "@settle/core";

interface StatementDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function StatementDrawer({ opened, onClose }: StatementDrawerProps) {
  const { addDocument, bankData, setBankData, documents, customGroupId, setCustomGroupId, studentId } = useDocContext();

  const [intrestStartIndex, setIntrestStartIndex] = useState(0);
  const [pastIntrestStartIndex, setPastIntrestStartIndex] = useState<number[]>([]);
  const [intrestRate, setIntrestRate] = useState(0);
  const [intrestDate, setIntrestDate] = useState<Date | null>(null);
  const [taxRate, setTaxRate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomGroupModal, setShowCustomGroupModal] = useState(false);

  const customGroupForm = useForm({
    initialValues: {
      name: "",
      description: "",
    },
  });

  const form = useForm({
    initialValues: {
      // Bank Template Selection
      bank_template: bankData?.bank_template || Object.keys(BANK_KEY_LABELS)[0] || "",

      // Account Details
      statement_ref_no: bankData?.statement_ref_no || "",
      statement_ref_no_statement: bankData?.statement_ref_no_statement || "",
      statement_account_no: bankData?.statement_account_no || "",
      statement_member_id: bankData?.statement_member_id || "",
      statement_account_holder: bankData?.statement_account_holder || "",
      statement_account_address: bankData?.statement_account_address || "",
      statement_account_type: bankData?.statement_account_type || "",
      statement_account_status: bankData?.statement_account_status || "",
      statement_start_date: bankData?.statement_start_date ? new Date(bankData.statement_start_date) : null,
      statement_end_date: bankData?.statement_end_date ? new Date(bankData.statement_end_date) : null,
      statement_interest_calculation: bankData?.statement_interest_calculation || "",
      statement_tax: bankData?.statement_tax || 0,
      statement_interest: bankData?.statement_interest || 0,
      statement_interest_method: bankData?.statement_interest_method || "",
      statement_interest_post: bankData?.statement_interest_post || "",
      statement_opening_balance: bankData?.statement_opening_balance || 0,
      statements_opening_bal: bankData?.statements_opening_bal || 0,
      statement_usdrate: bankData?.statement_usdrate || 0,
      statement_usdrate_equiv: bankData?.statement_usdrate_equiv || 0,
      statement_total_balance_words: bankData?.statement_total_balance_words || "",
      statement_total_balance_words_usd: bankData?.statement_total_balance_words_usd || "",
      statement_spokesperson: bankData?.statement_spokesperson || "",
      statement_spokesperson_post: bankData?.statement_spokesperson_post || "",

      // Statement Table
      statements_opening_date: bankData?.statements_opening_date ? new Date(bankData.statements_opening_date) : null,
      statements_has_code: bankData?.statements_has_code || false,
      statements_has_cheque: bankData?.statements_has_cheque || false,
      statements: bankData?.statements || [
        { date: "", description: "", debit: 0, credit: 0, code: "", cheque: "", key: randomId() },
      ],
      intrestStartIndex: bankData?.intrestStartIndex || 0,
      pastIntrestStartIndex: bankData?.pastIntrestStartIndex || [],
    },
  });

  useEffect(() => {
    if (opened && bankData) {
      // Update interest indices
      setIntrestStartIndex(bankData.intrestStartIndex || 0);
      setPastIntrestStartIndex(bankData.pastIntrestStartIndex || []);

      // Reset form to populate with existing bankData
      console.log("Drawer opened with bankData, resetting form");
      form.reset();
    } else if (opened && !bankData) {
      // New statement - reset form to initial values
      console.log("Drawer opened for new statement, resetting form");
      form.reset();
    }
  }, [opened, bankData]);

  const calculateBalance = (id: number) => {
    let balance = form.values.statements_opening_bal;
    for (const [, item] of form.values.statements.slice(0, id + 1).entries()) {
      balance += item.credit - item.debit;
    }
    return balance;
  };

  const calculateDebit = (id: number) => {
    let debit = 0;
    for (const [, item] of form.values.statements.slice(0, id + 1).entries()) {
      debit += item.debit || 0;
    }
    return debit;
  };

  const calculateCredit = (id: number) => {
    let credit = 0;
    for (const [, item] of form.values.statements.slice(0, id + 1).entries()) {
      credit += item.credit || 0;
    }
    return credit;
  };

  const roundHalfToEven = (num: any) => {
    const factor = Math.pow(10, 2);
    return Math.round(num * factor) / factor;
  };

  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: "Delete Entry",
      children: <Text size="xs">This action cannot be reverted. Are you sure?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red", size: "xs" },
      cancelProps: { size: "xs" },
      onConfirm: () => form.removeListItem("statements", id),
    });
  };

  const handleCalculations = async () => {
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
        .map((item: any, index: number) => ({
          ...item,
          balance: roundHalfToEven(calculateBalance(index + intrestStartIndex)),
        }));

      const calculateLastItem = () => ({
        balance: roundHalfToEven(calculateBalance(intrestStartIndex + itemsOfIntrest.length)),
        date: intrestDate,
      });

      const _dataToCalculate = [
        calculateFirstItem(),
        ...itemsOfIntrest,
        calculateLastItem(),
      ];

      const _dataToOperate = _dataToCalculate
        .slice(0, _dataToCalculate.length - 1)
        .map((item: any, index) => {
          const startDate = new Date(item.date);
          const endDate = new Date(_dataToCalculate[index + 1].date);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
          return {
            balance: item.balance,
            days,
            calculatedIntrest: Number(item.balance * (intrestRate / 100 / 365) * days),
          };
        });

      let _acquiredIntrest = 0;
      for (let index = 0; index < _dataToOperate.length; index++) {
        _acquiredIntrest = Number(_acquiredIntrest + _dataToOperate[index].calculatedIntrest);
      }

      form.insertListItem("statements", {
        date: intrestDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        description: "Interest",
        credit: roundHalfToEven(Number(_acquiredIntrest)),
        debit: 0,
        code: "INT",
        cheque: "",
        key: randomId(),
        highlight: true,
      });

      form.insertListItem("statements", {
        date: intrestDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        description: "Tax Deduction",
        credit: 0,
        debit: Number((_acquiredIntrest * (taxRate / 100)).toFixed(2)),
        code: "TAX",
        cheque: "",
        key: randomId(),
        highlight: true,
      });

      form.setFieldValue("pastIntrestStartIndex", [...pastIntrestStartIndex, intrestStartIndex]);
      setPastIntrestStartIndex([...pastIntrestStartIndex, intrestStartIndex]);
      setIntrestStartIndex(intrestStartIndex + itemsOfIntrest.length + 2);
      form.setFieldValue("intrestStartIndex", intrestStartIndex + itemsOfIntrest.length + 2);
    } catch (err) {
      console.error("Calculation error:", err);
    }
  };

  const handleSubmit = async () => {
    console.log("Form submitted with bank_template:", form.values.bank_template);

    // Validate bank is selected
    if (!form.values.bank_template) {
      notifications.show({
        title: "Validation Error",
        message: "Please select a bank template",
        color: "red",
      });
      return;
    }

    // If custom group is needed but not set, open modal to collect details
    if (!studentId && !customGroupId) {
      setShowCustomGroupModal(true);
      return;
    }

    await saveBankStatement(customGroupId);
  };

  const saveBankStatement = async (customId: number | null) => {
    setIsLoading(true);
    try {
      console.log("Starting bank statement save with customId:", customId);
      console.log("Form values:", form.values);

      // Validate bank template is selected
      if (!form.values.bank_template) {
        throw new Error("Please select a bank template");
      }

      const bankLabel = BANK_KEY_LABELS[form.values.bank_template];
      console.log("Selected bank template:", form.values.bank_template, "Label:", bankLabel);
      if (!bankLabel) {
        throw new Error("Invalid bank template selected");
      }

      // Calculate debit and credit totals
      let totalDebit = 0;
      let totalCredit = 0;
      const statements = form.values.statements || [];
      statements.forEach((stmt: any) => {
        totalDebit += stmt.debit || 0;
        totalCredit += stmt.credit || 0;
      });

      // Format data for API - match the structure expected by transformBankTemplate
      const templateData = {
        header: `${bankLabel} - Statement`,
        body: {
          bank_template: form.values.bank_template,
          statement_ref_no: form.values.statement_ref_no,
          statement_ref_no_statement: form.values.statement_ref_no_statement,
          statement_account_no: form.values.statement_account_no,
          statement_member_id: form.values.statement_member_id,
          statement_account_holder: form.values.statement_account_holder,
          statement_account_address: form.values.statement_account_address,
          statement_account_type: form.values.statement_account_type,
          statement_account_status: form.values.statement_account_status,
          statement_start_date: form.values.statement_start_date,
          statement_end_date: form.values.statement_end_date,
          statement_interest_calculation: form.values.statement_interest_calculation,
          statement_tax: form.values.statement_tax,
          statement_interest: form.values.statement_interest,
          statement_interest_method: form.values.statement_interest_method,
          statement_interest_post: form.values.statement_interest_post,
          statement_opening_balance: form.values.statement_opening_balance,
          statements_opening_bal: form.values.statements_opening_bal,
          statement_usdrate: form.values.statement_usdrate,
          statement_usdrate_equiv: form.values.statement_usdrate_equiv,
          statement_total_balance_words: form.values.statement_total_balance_words,
          statement_total_balance_words_usd: form.values.statement_total_balance_words_usd,
          statement_spokesperson: form.values.statement_spokesperson,
          statement_spokesperson_post: form.values.statement_spokesperson_post,
          statements_opening_date: form.values.statements_opening_date,
          statements_has_code: form.values.statements_has_code,
          statements_has_cheque: form.values.statements_has_cheque,
          statements: statements,
          intrestStartIndex: form.values.intrestStartIndex,
          pastIntrestStartIndex: form.values.pastIntrestStartIndex,
          // Add calculated totals
          workedStatements: statements,
          statement_debit_total: totalDebit,
          statement_credit_total: totalCredit,
        },
      };

      const statementPayload = {
        name: `${bankLabel} Statement`,
        template: templateData,
        document_type: "bank_statement",
        bank: form.values.bank_template,
        student: studentId || null,
        custom: customId || null,
      };

      let savedStatement: any;
      console.log("Statement payload to be saved:", statementPayload);

      // Create new statement
      console.log("Creating new statement...");
      savedStatement = await moduleApiCall.createRecord({
        endpoint: "/api/documents/statements/",
        body: statementPayload,
      });

      console.log("API response - savedStatement:", savedStatement);

      if (!savedStatement) {
        throw new Error("Failed to save statement");
      }

      // Update local context with all required fields
      const bankDataForContext = {
        ...form.values,
        bank: form.values.bank_template,
        accountHolderName: form.values.statement_account_holder,
        accountNumber: form.values.statement_account_no,
        accountType: form.values.statement_account_type as "savings" | "current",
        // Add calculated fields that templates expect
        workedStatements: statements,
        statement_debit_total: totalDebit,
        statement_credit_total: totalCredit,
      };

      console.log("Setting bank data in context:", bankDataForContext);
      setBankData(bankDataForContext as any);

      const hasBankDoc = documents.some((d) => d.type === "bank-statement");
      console.log("Has existing bank doc:", hasBankDoc);

      if (!hasBankDoc) {
        console.log("Adding new bank statement document with ID:", savedStatement.id);
        addDocument("bank-statement", { bankKey: form.values.bank_template, statementId: savedStatement.id });
      } else {
        console.log("Bank doc already exists, updating statementId if needed");
      }

      notifications.show({
        title: "Success",
        message: "Statement saved successfully",
        color: "green",
      });

      form.reset();
      onClose();
    } catch (error) {
      console.error("Error saving statement:", error);
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to save statement",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCustomGroup = async () => {
    if (!customGroupForm.values.name.trim()) {
      notifications.show({
        title: "Error",
        message: "Please enter a name for the custom group",
        color: "red",
      });
      return;
    }

    try {
      const customPayload = {
        name: customGroupForm.values.name,
        description: customGroupForm.values.description,
        is_active: true,
      };

      const customData: any = await moduleApiCall.createRecord({
        endpoint: "/api/documents/customs/",
        body: customPayload,
      });

      if (!customData) throw new Error("Failed to create custom group");

      setShowCustomGroupModal(false);
      customGroupForm.reset();

      // Update context with the new custom group ID (triggers URL sync)
      setCustomGroupId(customData.id);

      // Now save the bank statement with the new custom group
      await saveBankStatement(customData.id);
    } catch (error) {
      console.error("Error creating custom group:", error);
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to create custom group",
        color: "red",
      });
    }
  };

  const tableInputStyle = {
    input: {
      background: "none",
      border: "none",
      fontSize: "var(--mantine-font-size-xs)",
    },
  };

  return (
    <Drawer
      opened={opened}
      onClose={() => {
        form.reset();
        onClose();
      }}
      position="right"
      size="xl"
      title="Bank Statement Form"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          {/* Bank Template Selection */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="md">Select Bank Template</Text>

            <Radio.Group
              value={form.values.bank_template}
              onChange={(e) => {
                form.setFieldValue("bank_template", e);
              }}
            >
              <SimpleGrid cols={2} spacing="xs">
                {Object.entries(BANK_KEY_LABELS).map(([key, label]) => (
                  <Radio.Card
                    radius="md"
                    value={key}
                    key={key}
                    p="sm"
                  >
                    <Group wrap="nowrap" align="center">
                      <Radio.Indicator size="xs" />
                      <div>
                        <Text size="xs">{label}</Text>
                      </div>
                    </Group>
                  </Radio.Card>
                ))}
              </SimpleGrid>
            </Radio.Group>
          </div>

          <Divider my="md" />

          {/* Account Details */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="md">Account Details</Text>
            <SimpleGrid spacing="xs" cols={4}>
              <TextInput
                label="Reference No. CERT."
                placeholder="e.g. SSCS-080-56786"
                {...form.getInputProps("statement_ref_no")}
              />
              <TextInput
                label="Reference No STMT."
                placeholder="e.g. SSCS-080-56786"
                {...form.getInputProps("statement_ref_no_statement")}
              />
              <TextInput
                label="Account No."
                placeholder="e.g. GS-011-172153"
                {...form.getInputProps("statement_account_no")}
              />
              <TextInput
                label="Member ID"
                placeholder="e.g. 05-5144"
                {...form.getInputProps("statement_member_id")}
              />
            </SimpleGrid>

            <SimpleGrid spacing="xs" cols={2}>
              <TextInput
                label="Account Holder"
                placeholder="e.g. Mr. Shree Narayan"
                {...form.getInputProps("statement_account_holder")}
              />
              <TextInput
                label="Account Holder's Address"
                placeholder="e.g. Gauriganj Rural Municipality..."
                {...form.getInputProps("statement_account_address")}
              />
              <TextInput
                label="Account Type"
                placeholder="e.g. General Saving"
                {...form.getInputProps("statement_account_type")}
              />
              <TextInput
                label="Account Status"
                placeholder="e.g. Running"
                {...form.getInputProps("statement_account_status")}
              />
            </SimpleGrid>

            <Divider my="md" />

            <Text size="xs" fw={600} tt="uppercase" mb="md">Statement Details</Text>

            <SimpleGrid spacing="xs" cols={4}>
              <DateInput
                label="Statement Start Date"
                placeholder="Select Date"
                {...form.getInputProps("statement_start_date")}
              />
              <DateInput
                label="Statement End Date"
                placeholder="Select Date"
                {...form.getInputProps("statement_end_date")}
              />
              <Select
                data={["Monthly", "Quarterly", "Yearly"]}
                label="Interest Calculation Type"
                placeholder="Select Type"
                {...form.getInputProps("statement_interest_calculation")}
              />
            </SimpleGrid>

            <SimpleGrid spacing="xs" cols={4}>
              <NumberInput
                hideControls
                min={0}
                label="Written TAX"
                placeholder="e.g. 6.0"
                {...form.getInputProps("statement_tax")}
              />
              <NumberInput
                hideControls
                min={0}
                label="Written Interest"
                placeholder="e.g. 6.5"
                {...form.getInputProps("statement_interest")}
              />
              <TextInput
                label="Interest Method"
                placeholder="e.g. Daily Balance Method"
                {...form.getInputProps("statement_interest_method")}
              />
              <TextInput
                label="Interest Post"
                placeholder="e.g. Monthly"
                {...form.getInputProps("statement_interest_post")}
              />
            </SimpleGrid>

            <Text size="xs" fw={600} tt="uppercase" mb="md" mt="md">Conversions</Text>

            <SimpleGrid spacing="xs" cols={3}>
              <NumberInput
                hideControls
                min={0}
                label="Opening Balance"
                placeholder="e.g. 1278492.18"
                {...form.getInputProps("statement_opening_balance")}
                onChange={(e) => {
                  const value = typeof e === 'string' ? parseFloat(e) || 0 : e;
                  form.setFieldValue("statement_opening_balance", value);
                  form.setFieldValue("statements_opening_bal", value);
                }}
              />
              <NumberInput
                hideControls
                min={0}
                label="USD Rate"
                placeholder="e.g. 133.53"
                {...form.getInputProps("statement_usdrate")}
                onChange={(e: string | number) => {
                  const value = typeof e === 'string' ? parseFloat(e) || 0 : e;
                  form.setFieldValue("statement_usdrate", value);
                  form.setFieldValue(
                    "statement_usdrate_equiv",
                    Number((Number(form.values.statements_opening_bal) / value).toFixed(2))
                  );
                }}
              />
              <NumberInput
                readOnly
                hideControls
                min={0}
                label="USD Equivalent"
                placeholder="Auto-filled"
                {...form.getInputProps("statement_usdrate_equiv")}
              />
            </SimpleGrid>

            <SimpleGrid spacing="xs" cols={2}>
              <TextInput
                label="NPR Balance in words"
                placeholder="Enter NPR Balance in words"
                {...form.getInputProps("statement_total_balance_words")}
              />
              <TextInput
                label="USD Balance in words"
                placeholder="Enter USD Balance in words"
                {...form.getInputProps("statement_total_balance_words_usd")}
              />
            </SimpleGrid>

            <Text size="xs" fw={600} tt="uppercase" mb="md" mt="md">Spokesperson</Text>

            <SimpleGrid spacing="xs" cols={2}>
              <TextInput
                label="Spokesperson Name"
                placeholder="e.g. Bibisha Shrestha"
                {...form.getInputProps("statement_spokesperson")}
              />
              <TextInput
                label="Spokesperson Post"
                placeholder="e.g. Manager"
                {...form.getInputProps("statement_spokesperson_post")}
              />
            </SimpleGrid>
          </div>

          <Divider my="md" />

          {/* Statement Entries */}
          <div>
            <Group justify="space-between" mb="md">
              <Text size="xs" fw={600} tt="uppercase">Statement Entries</Text>
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
                      cheque: "",
                      key: randomId(),
                    })
                  }
                  size="xs"
                  variant="light"
                  leftSection={<Plus size={14} />}
                >
                  Add Entry
                </Button>
              </Group>
            </Group>

            <div style={{ overflowX: "auto" }}>
              <Table withColumnBorders withTableBorder verticalSpacing="xs" horizontalSpacing="xs">
                <Table.Thead style={{ background: "var(--mantine-color-gray-0)" }}>
                  <Table.Tr>
                    <Table.Th w={100} p="sm"><Text size="xs" fw={600}>Date</Text></Table.Th>
                    <Table.Th w={200} p="sm"><Text size="xs" fw={600}>Description</Text></Table.Th>
                    {form.values.statements_has_code && <Table.Th w={80} p="sm"><Text size="xs" fw={600}>Code</Text></Table.Th>}
                    {form.values.statements_has_cheque && <Table.Th w={100} p="sm"><Text size="xs" fw={600}>Cheque No.</Text></Table.Th>}
                    <Table.Th w={120} p="sm"><Text size="xs" fw={600}>Debit</Text></Table.Th>
                    <Table.Th w={120} p="sm"><Text size="xs" fw={600}>Credit</Text></Table.Th>
                    <Table.Th w={120} p="sm"><Text size="xs" fw={600}>Balance</Text></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>
                      <DateInput
                        valueFormat="YYYY/MM/DD"
                        variant="filled"
                        placeholder="Date"
                        {...form.getInputProps("statements_opening_date")}
                        styles={tableInputStyle}
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
                        variant="filled"
                        placeholder="Balance"
                        {...form.getInputProps("statements_opening_bal")}
                        styles={tableInputStyle}
                      />
                    </Table.Td>
                  </Table.Tr>

                  {form.getValues().statements.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Center px="xl" py={64}>
                          <Text size="xs" ta="center">
                            No statements available. Click <b>Add Entry</b> to start.
                          </Text>
                        </Center>
                      </Table.Td>
                    </Table.Tr>
                  )}

                  {form.getValues().statements.map((item: any, index: number) => (
                    <Table.Tr key={index} bg={item.highlight ? "gray.0" : "none"}>
                      <Table.Td>
                        <DateInput
                          valueFormat="YYYY/MM/DD"
                          variant="filled"
                          placeholder="Date"
                          {...form.getInputProps(`statements.${index}.date`)}
                          styles={tableInputStyle}
                        />
                      </Table.Td>
                      <Table.Td>
                        <TextInput
                          variant="filled"
                          placeholder="Description"
                          {...form.getInputProps(`statements.${index}.description`)}
                          styles={tableInputStyle}
                        />
                      </Table.Td>
                      {form.values.statements_has_code && (
                        <Table.Td>
                          <TextInput
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
                            variant="filled"
                            placeholder="Cheque"
                            {...form.getInputProps(`statements.${index}.cheque`)}
                            styles={tableInputStyle}
                          />
                        </Table.Td>
                      )}
                      <Table.Td>
                        <NumberInput
                          hideControls
                          min={0}
                          variant="filled"
                          placeholder="Debit"
                          {...form.getInputProps(`statements.${index}.debit`)}
                          styles={tableInputStyle}
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          min={0}
                          variant="filled"
                          placeholder="Credit"
                          {...form.getInputProps(`statements.${index}.credit`)}
                          styles={tableInputStyle}
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          readOnly
                          hideControls
                          min={0}
                          variant="filled"
                          placeholder="Balance"
                          value={calculateBalance(index)}
                          styles={tableInputStyle}
                          rightSection={
                            <ActionIcon
                              radius="xl"
                              color="red"
                              variant="light"
                              onClick={() => handleDelete(index)}
                              size="xs"
                            >
                              <Minus size={12} />
                            </ActionIcon>
                          }
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}

                  <Table.Tr bg="brand.0">
                    <Table.Td colSpan={2}>
                      <Text size="xs" px="sm">Statement Summary</Text>
                    </Table.Td>
                    {form.values.statements_has_code && <Table.Td></Table.Td>}
                    {form.values.statements_has_cheque && <Table.Td></Table.Td>}
                    <Table.Td>
                      <NumberInput
                        readOnly
                        hideControls
                        min={0}
                        variant="filled"
                        placeholder="Debit"
                        value={calculateDebit(form.values.statements.length - 1)}
                        styles={tableInputStyle}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        readOnly
                        hideControls
                        min={0}
                        variant="filled"
                        placeholder="Credit"
                        value={calculateCredit(form.values.statements.length - 1)}
                        styles={tableInputStyle}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        readOnly
                        hideControls
                        min={0}
                        variant="filled"
                        placeholder="Balance"
                        value={calculateBalance(form.values.statements.length - 1)}
                        styles={tableInputStyle}
                      />
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>

            <Group justify="space-between" gap="xs" mt="md" mb="md">
              <Text size="xs">
                Generate Interest & TAX <b>({form.values.statements.length - intrestStartIndex})</b>
              </Text>
              <Group gap="xs">
                <DateInput
                  w={130}
                  valueFormat="YYYY/MM/DD"
                  size="xs"
                  placeholder="Select Date"
                  onChange={(e: any) => setIntrestDate(e)}
                />
                <NumberInput
                  w={130}
                  rightSection={<Text size="xs">%</Text>}
                  leftSection={<Text size="xs">Int.:</Text>}
                  hideControls
                  min={0}
                  size="xs"
                  placeholder="00.00"
                  onChange={(e: any) => setIntrestRate(e)}
                />
                <NumberInput
                  w={130}
                  rightSection={<Text size="xs">%</Text>}
                  leftSection={<Text size="xs">Tax:</Text>}
                  hideControls
                  min={0}
                  size="xs"
                  placeholder="00.00"
                  onChange={(e: any) => setTaxRate(e)}
                />
                <Button
                  variant="outline"
                  onClick={handleCalculations}
                  size="xs"
                  leftSection={<Calculator size={14} />}
                  disabled={
                    (form.values.statements.length <= intrestStartIndex &&
                      form.values.statements.length !== 0) ||
                    !intrestDate ||
                    !intrestRate ||
                    !taxRate
                  }
                >
                  Calculate
                </Button>
              </Group>
            </Group>
          </div>

          <Divider my="md" />

          <Group justify="flex-end">
            <Button
              variant="light"
              onClick={() => {
                form.reset();
                onClose();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Document"}
            </Button>
          </Group>
        </Stack>
      </form>

      <Modal
        opened={showCustomGroupModal}
        onClose={() => {
          setShowCustomGroupModal(false);
          customGroupForm.reset();
        }}
        title=<Text size="sm">Save Document</Text>
        centered
      >
        <Box p="md">
          <Stack gap="md">
            <TextInput
              label="Document Name"
              placeholder="e.g. MySchool Documents"
              {...customGroupForm.getInputProps("name")}
              autoFocus
              required
            />
            <Textarea
              label="Remarks"
              placeholder="Enter remarks for this document (optional)"
              {...customGroupForm.getInputProps("description")}
              rows={3}
            />
            <Group justify="flex-end">
              <Button
                variant="light"
                onClick={() => {
                  setShowCustomGroupModal(false);
                  customGroupForm.reset();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateCustomGroup} loading={isLoading}>
                Save
              </Button>
            </Group>
          </Stack>
        </Box>
      </Modal>
    </Drawer>
  );
}
