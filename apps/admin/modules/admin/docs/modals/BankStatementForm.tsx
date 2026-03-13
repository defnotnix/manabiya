"use client";

import { ComponentType, useState } from "react";
import {
  Button,
  Container,
  Group,
  Modal,
  Paper,
  Stack,
  Tabs,
  Text,
  TextInput,
  Select,
  NumberInput,
  ActionIcon,
  Table,
  Badge,
} from "@mantine/core";
import { CaretLeft, CaretRight, CheckCircle, X } from "@phosphor-icons/react";
import { useDocContext } from "../context";
import { BankTemplates } from "../templates/bank";
import { ContextEditor } from "@/components/layout/editor/editor.context";
import { FormHandler } from "@/components/framework/FormHandler";

type BankStatementFormData = {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: string;
  statements: {
    date: string;
    amount: number;
    description: string;
  }[];
};

/** Wraps templates in the stub providers they expect */
function TemplateShell({ children }: { children: React.ReactNode }) {
  return (
    <ContextEditor.Provider>
      <FormHandler.Provider>
        {children}
      </FormHandler.Provider>
    </ContextEditor.Provider>
  );
}

export function BankStatementForm() {
  const { activeDocument } = useDocContext();
  const [activeTab, setActiveTab] = useState<string>("0");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [formData, setFormData] = useState<BankStatementFormData>({
    bankName: activeDocument?.meta?.bankKey || "",
    accountHolderName: "",
    accountNumber: "",
    accountType: "savings",
    statements: [],
  });

  const tabs = [
    {
      label: "Account Holder Details",
      value: "0",
      description: "Account holder details for the document",
    },
    {
      label: "Statements",
      value: "1",
      description: "Statements for the document",
    },
  ];

  const handleNextTab = () => {
    setActiveTab(String(Number(activeTab) + 1));
  };

  const handlePreviousTab = () => {
    setActiveTab(String(Number(activeTab) - 1));
  };

  const handleSubmit = () => {
    console.log("Form data:", formData);
    setIsModalOpen(false);
  };

  // Render templates
  if (!isModalOpen && activeDocument?.meta?.bankKey) {
    const bank = BankTemplates[activeDocument.meta.bankKey as keyof typeof BankTemplates];
    if (bank) {
      const Certificate = bank.certificate as ComponentType;
      const Statement = bank.statement as ComponentType;
      return (
        <Stack gap={0}>
          <TemplateShell><Certificate /></TemplateShell>
          <TemplateShell><Statement /></TemplateShell>
        </Stack>
      );
    }
  }

  return (
    <>
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Bank Statement - ${activeDocument?.label || "Document"}`}
        size="lg"
        centered
      >
        <Stack gap="md">
      <Tabs defaultValue="0" value={activeTab} onChange={setActiveTab}>
        <Paper>
          <Container size="lg">
            <Tabs.List>
              {tabs.map((tab) => (
                <Tabs.Tab key={tab.value} value={tab.value}>
                  <Stack gap={4}>
                    <Text size="xs">{tab.label}</Text>
                    <Text size="10px" opacity={0.5}>
                      {tab.description}
                    </Text>
                  </Stack>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Container>
        </Paper>

        <Container size="lg">
          <Tabs.Panel value="0" py="md">
            <Stack gap="md">
              <Text fw={600} size="sm">
                Account Holder Information
              </Text>
              <Stack gap="sm">
                <TextInput
                  label="Bank Name"
                  value={formData.bankName}
                  disabled
                  placeholder="Bank name"
                />
                <TextInput
                  label="Account Holder Name"
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    setFormData({ ...formData, accountHolderName: e.target.value })
                  }
                  placeholder="Full name"
                  required
                />
                <TextInput
                  label="Account Number"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  placeholder="Account number"
                  required
                />
                <Select
                  label="Account Type"
                  value={formData.accountType}
                  onChange={(value) =>
                    setFormData({ ...formData, accountType: value || "savings" })
                  }
                  data={[
                    { value: "savings", label: "Savings" },
                    { value: "checking", label: "Checking" },
                    { value: "business", label: "Business" },
                  ]}
                  required
                />
              </Stack>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="1" py="md">
            <Stack gap="md">
              <div>
                <Text fw={600} size="sm" mb="md">
                  Bank Statements
                </Text>
                {formData.statements.length > 0 ? (
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Amount</Table.Th>
                        <Table.Th>Description</Table.Th>
                        <Table.Th>Action</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {formData.statements.map((statement, index) => (
                        <Table.Tr key={index}>
                          <Table.Td>{statement.date}</Table.Td>
                          <Table.Td>{statement.amount}</Table.Td>
                          <Table.Td>{statement.description}</Table.Td>
                          <Table.Td>
                            <ActionIcon
                              color="red"
                              variant="subtle"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  statements: formData.statements.filter(
                                    (_, i) => i !== index
                                  ),
                                });
                              }}
                            >
                              <X size={16} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                ) : (
                  <Text size="sm" c="dimmed">
                    No statements added yet
                  </Text>
                )}
              </div>

              <div>
                <Text fw={600} size="sm" mb="md">
                  Add Statement
                </Text>
                <Stack gap="sm">
                  <TextInput
                    label="Date"
                    type="date"
                    id="statementDate"
                    placeholder="YYYY-MM-DD"
                    onChange={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      document.getElementById("statementDate")?.setAttribute("data-date", value);
                    }}
                  />
                  <NumberInput
                    label="Amount"
                    placeholder="0.00"
                    step={0.01}
                    id="statementAmount"
                  />
                  <TextInput
                    label="Description"
                    placeholder="Description"
                    id="statementDescription"
                  />
                  <Button
                    onClick={() => {
                      const dateInput = document.getElementById("statementDate") as HTMLInputElement;
                      const amountInput = document.getElementById("statementAmount") as HTMLInputElement;
                      const descInput = document.getElementById("statementDescription") as HTMLInputElement;

                      if (dateInput?.value && amountInput?.value && descInput?.value) {
                        setFormData({
                          ...formData,
                          statements: [
                            ...formData.statements,
                            {
                              date: dateInput.value,
                              amount: parseFloat(amountInput.value),
                              description: descInput.value,
                            },
                          ],
                        });
                        dateInput.value = "";
                        amountInput.value = "";
                        descInput.value = "";
                      }
                    }}
                  >
                    Add Statement
                  </Button>
                </Stack>
              </div>
            </Stack>
          </Tabs.Panel>
        </Container>
      </Tabs>

        <Group justify="flex-end" gap="xs">
          <Button
            disabled={activeTab === "0"}
            variant="light"
            leftSection={<CaretLeft />}
            onClick={handlePreviousTab}
          >
            Back
          </Button>
          {activeTab === "1" ? (
            <Button rightSection={<CheckCircle />} onClick={handleSubmit}>
              View without saving
            </Button>
          ) : (
            <Button rightSection={<CaretRight />} onClick={handleNextTab}>
              Next
            </Button>
          )}
        </Group>
        </Stack>
      </Modal>
    </>
  );
}
