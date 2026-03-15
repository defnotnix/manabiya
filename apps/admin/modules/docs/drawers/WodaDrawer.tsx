"use client";

import { useEffect, useContext, useState } from "react";
import {
  Drawer,
  Stack,
  TextInput,
  Select,
  Textarea,
  Button,
  Group,
  Container,
  Paper,
  Divider,
  Switch,
  SimpleGrid,
  NumberInput,
  ActionIcon,
  Grid,
  Text,
  Loader,
  Modal,
  Box,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useDocContext, WODA_SUB_LABELS, WodaDocData } from "@/context/DocumentContext";
import { ContextEditor } from "@/components/layout/editor/editor.context";
import { notifications } from "@mantine/notifications";
import { moduleApiCall, FormHandler } from "@settle/core";
import moment from "moment";
//@ts-ignore
import adbs from "ad-bs-converter";


interface WodaDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function WodaDrawer({ opened, onClose }: WodaDrawerProps) {
  const { addDocument, wodaData, setWodaData, documents, customGroupId, setCustomGroupId, studentId, activeDocument } = useDocContext();
  const { dispatch } = useContext(ContextEditor.Context) || { dispatch: () => { } };
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
      // Document Info
      municipality: wodaData?.municipality || "tokyo",

      // FormWodaGeneral fields
      wodadoc_refno: wodaData?.wodadoc_refno || "",
      wodadoc_date: wodaData?.wodadoc_date ? new Date(wodaData.wodadoc_date) : null,
      spokesperson_name: wodaData?.spokesperson_name || "",
      spokesperson_post: wodaData?.spokesperson_post || "",
      spokesperson_contact: wodaData?.spokesperson_contact || "",

      // Relationship Tab
      signature_issued_act_relationship: wodaData?.signature_issued_act_relationship || "",
      extra_relation: wodaData?.extra_relation || false,
      relation_extra_honorific: wodaData?.relation_extra_honorific || "",
      relation_extra_name: wodaData?.relation_extra_name || "",
      relation_extra_relation: wodaData?.relation_extra_relation || "",

      // Fiscal Tab
      fiscal_1_bs: wodaData?.fiscal_1_bs || "",
      fiscal_1_ad: wodaData?.fiscal_1_ad || "",
      fiscal_fullfiscal_1: wodaData?.fiscal_fullfiscal_1 || "",
      fiscal_2_bs: wodaData?.fiscal_2_bs || "",
      fiscal_2_ad: wodaData?.fiscal_2_ad || "",
      fiscal_fullfiscal_2: wodaData?.fiscal_fullfiscal_2 || "",
      fiscal_3_bs: wodaData?.fiscal_3_bs || "",
      fiscal_3_ad: wodaData?.fiscal_3_ad || "",
      fiscal_fullfiscal_3: wodaData?.fiscal_fullfiscal_3 || "",

      // Occupation Tab
      applicant_earning_guardian: wodaData?.applicant_earning_guardian || "",
      occupations: wodaData?.occupations || [{ name: "", income1: 0, income2: 0, income3: 0 }],
      occupation_note: wodaData?.occupation_note || "",

      // DOB Tab
      signature_issued_act_dob: wodaData?.signature_issued_act_dob || "",

      // Income Tab
      usd_rate: wodaData?.usd_rate || 0,
      rate_date: wodaData?.rate_date ? new Date(wodaData.rate_date) : null,

      // Tax Tab
      tax: wodaData?.tax || 0,
      tax_clearance_issuer: wodaData?.tax_clearance_issuer || "",
      signature_tax: wodaData?.signature_tax || "",

      // Migration Tab
      initial_address: wodaData?.initial_address || "",
      migration_date: wodaData?.migration_date ? new Date(wodaData.migration_date) : null,
      signature_migration_alongwith: wodaData?.signature_migration_alongwith || "",

      // Surname Tab
      applicant_surname_reference: wodaData?.applicant_surname_reference || "",
      applicant_parents_surname: wodaData?.applicant_parents_surname || "",
      applicant_surname: wodaData?.applicant_surname || "",

      // Address Tab
      initial_address_name: wodaData?.initial_address_name || "",
      address_name_change_date: wodaData?.address_name_change_date ? new Date(wodaData.address_name_change_date) : null,
      address_name_change_date_bs: wodaData?.address_name_change_date_bs || "",

      // Applicant Details
      applicant_gender: wodaData?.applicant_gender || "",
      applicant_honorific: wodaData?.applicant_honorific || "",
      applicant_name: wodaData?.applicant_name || "",
      applicant_permanent_address: wodaData?.applicant_permanent_address || "",
      applicant_dob: wodaData?.applicant_dob ? new Date(wodaData.applicant_dob) : null,
      applicant_dob_bs: wodaData?.applicant_dob_bs || "",
      applicant_birth_address: wodaData?.applicant_birth_address || "",
      applicant_citizenship: wodaData?.applicant_citizenship || "",
      applicant_citizenship_issuer: wodaData?.applicant_citizenship_issuer || "",
      applicant_father_honorific: wodaData?.applicant_father_honorific || "",
      applicant_father_name: wodaData?.applicant_father_name || "",
      applicant_mother_honorific: wodaData?.applicant_mother_honorific || "",
      applicant_mother_name: wodaData?.applicant_mother_name || "",
    },
  });

  useEffect(() => {
    if (opened && wodaData) {
      form.setValues({
        municipality: wodaData.municipality || "tokyo",
        wodadoc_refno: wodaData.wodadoc_refno || "",
        wodadoc_date: wodaData.wodadoc_date ? new Date(wodaData.wodadoc_date) : null,
        spokesperson_name: wodaData.spokesperson_name || "",
        spokesperson_post: wodaData.spokesperson_post || "",
        spokesperson_contact: wodaData.spokesperson_contact || "",
        signature_issued_act_relationship: wodaData.signature_issued_act_relationship || "",
        extra_relation: wodaData.extra_relation || false,
        relation_extra_honorific: wodaData.relation_extra_honorific || "",
        relation_extra_name: wodaData.relation_extra_name || "",
        relation_extra_relation: wodaData.relation_extra_relation || "",
        fiscal_1_bs: wodaData.fiscal_1_bs || "",
        fiscal_1_ad: wodaData.fiscal_1_ad || "",
        fiscal_fullfiscal_1: wodaData.fiscal_fullfiscal_1 || "",
        fiscal_2_bs: wodaData.fiscal_2_bs || "",
        fiscal_2_ad: wodaData.fiscal_2_ad || "",
        fiscal_fullfiscal_2: wodaData.fiscal_fullfiscal_2 || "",
        fiscal_3_bs: wodaData.fiscal_3_bs || "",
        fiscal_3_ad: wodaData.fiscal_3_ad || "",
        fiscal_fullfiscal_3: wodaData.fiscal_fullfiscal_3 || "",
        applicant_earning_guardian: wodaData.applicant_earning_guardian || "",
        occupations: wodaData.occupations || [{ name: "", income1: 0, income2: 0, income3: 0 }],
        occupation_note: wodaData.occupation_note || "",
        signature_issued_act_dob: wodaData.signature_issued_act_dob || "",
        usd_rate: wodaData.usd_rate || 0,
        rate_date: wodaData.rate_date ? new Date(wodaData.rate_date) : null,
        tax: wodaData.tax || 0,
        tax_clearance_issuer: wodaData.tax_clearance_issuer || "",
        signature_tax: wodaData.signature_tax || "",
        initial_address: wodaData.initial_address || "",
        migration_date: wodaData.migration_date ? new Date(wodaData.migration_date) : null,
        signature_migration_alongwith: wodaData.signature_migration_alongwith || "",
        applicant_surname_reference: wodaData.applicant_surname_reference || "",
        applicant_parents_surname: wodaData.applicant_parents_surname || "",
        applicant_surname: wodaData.applicant_surname || "",
        initial_address_name: wodaData.initial_address_name || "",
        address_name_change_date: wodaData.address_name_change_date ? new Date(wodaData.address_name_change_date) : null,
        address_name_change_date_bs: wodaData.address_name_change_date_bs || "",
        applicant_gender: wodaData.applicant_gender || "",
        applicant_honorific: wodaData.applicant_honorific || "",
        applicant_name: wodaData.applicant_name || "",
        applicant_permanent_address: wodaData.applicant_permanent_address || "",
        applicant_dob: wodaData.applicant_dob ? new Date(wodaData.applicant_dob) : null,
        applicant_dob_bs: wodaData.applicant_dob_bs || "",
        applicant_birth_address: wodaData.applicant_birth_address || "",
        applicant_citizenship: wodaData.applicant_citizenship || "",
        applicant_citizenship_issuer: wodaData.applicant_citizenship_issuer || "",
        applicant_father_honorific: wodaData.applicant_father_honorific || "",
        applicant_father_name: wodaData.applicant_father_name || "",
        applicant_mother_honorific: wodaData.applicant_mother_honorific || "",
        applicant_mother_name: wodaData.applicant_mother_name || "",
      });
    } else if (opened) {
      form.reset();
    }
  }, [opened]);

  const handleSubmit = async () => {
    // If custom group is needed but not set, open modal to collect details
    if (!studentId && !customGroupId) {
      setShowCustomGroupModal(true);
      return;
    }

    await saveWodaDocument(customGroupId);
  };

  const saveWodaDocument = async (customId: number | null) => {
    setIsLoading(true);
    try {
      // Format data for API
      const templateData = {
        header: "Woda Documents",
        body: {
          general: {
            refNo: form.values.wodadoc_refno,
            date: form.values.wodadoc_date,
            spokesperson: {
              name: form.values.spokesperson_name,
              post: form.values.spokesperson_post,
              contact: form.values.spokesperson_contact,
            },
          },
          relationship: {
            issuedAct: form.values.signature_issued_act_relationship,
            extraRelation: form.values.extra_relation,
            extraPersonnel: form.values.extra_relation
              ? {
                honorific: form.values.relation_extra_honorific,
                name: form.values.relation_extra_name,
                relation: form.values.relation_extra_relation,
              }
              : null,
          },
          fiscal: {
            years: [1, 2, 3].map((year) => ({
              bs: form.values[`fiscal_${year}_bs` as keyof typeof form.values],
              ad: form.values[`fiscal_${year}_ad` as keyof typeof form.values],
              fullText: form.values[`fiscal_fullfiscal_${year}` as keyof typeof form.values],
            })),
          },
          occupation: {
            earningGuardian: form.values.applicant_earning_guardian,
            occupations: form.values.occupations,
            note: form.values.occupation_note,
          },
          dob: {
            verificationText: form.values.signature_issued_act_dob,
          },
          income: {
            usdRate: form.values.usd_rate,
            rateDate: form.values.rate_date,
          },
          tax: {
            rate: form.values.tax,
            clearanceIssuer: form.values.tax_clearance_issuer,
            signatureText: form.values.signature_tax,
          },
          migration: {
            initialAddress: form.values.initial_address,
            migrationDate: form.values.migration_date,
            alongwith: form.values.signature_migration_alongwith,
          },
          surname: {
            comparedWith: form.values.applicant_surname_reference,
            parentsSurname: form.values.applicant_parents_surname,
            applicantSurname: form.values.applicant_surname,
          },
          address: {
            initialName: form.values.initial_address_name,
            changeDate: form.values.address_name_change_date,
            changeDateBs: form.values.address_name_change_date_bs,
          },
          applicant: {
            gender: form.values.applicant_gender,
            honorific: form.values.applicant_honorific,
            name: form.values.applicant_name,
            permanentAddress: form.values.applicant_permanent_address,
            dob: form.values.applicant_dob,
            dobBs: form.values.applicant_dob_bs,
            birthAddress: form.values.applicant_birth_address,
            citizenship: form.values.applicant_citizenship,
            citizenshipIssuer: form.values.applicant_citizenship_issuer,
            father: {
              honorific: form.values.applicant_father_honorific,
              name: form.values.applicant_father_name,
            },
            mother: {
              honorific: form.values.applicant_mother_honorific,
              name: form.values.applicant_mother_name,
            },
          },
        },
      };

      const wodaPayload = {
        name: `Woda Documents - ${form.values.applicant_surname || "Applicant"}`,
        template: templateData,
        document_type: "woda",
        municipality: form.values.municipality || "tokyo",
        student: studentId || null,
        custom: customId || null,
      };

      // Check if editing existing document
      const existingWodaId = activeDocument?.type === "woda-documents" ? activeDocument.meta?.wodaDocId : null;

      let savedWoda: any;
      if (existingWodaId) {
        // Update existing woda document
        savedWoda = await moduleApiCall.editRecord({
          endpoint: "/api/documents/woda-docs/",
          id: existingWodaId,
          body: wodaPayload,
        });
      } else {
        // Create new woda document
        savedWoda = await moduleApiCall.createRecord({
          endpoint: "/api/documents/woda-docs/",
          body: wodaPayload,
        });
      }

      if (!savedWoda) {
        throw new Error("Failed to save woda document");
      }

      // Update local context
      const data = {
        ...form.values,
        applicantName: form.values.applicant_surname || "Woda Document",
        documentType: "woda_documents",
        notes: "",
      };

      setWodaData(data as any);

      const hasWodaDoc = documents.some((d) => d.type === "woda-documents");
      if (!hasWodaDoc) {
        addDocument("woda-documents", { wodaDocId: savedWoda.id });
      }

      notifications.show({
        title: "Success",
        message: "Woda document saved successfully",
        color: "green",
      });

      form.reset();
      onClose();
    } catch (error) {
      console.error("Error saving woda document:", error);
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to save woda document",
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

      // Now save the woda document with the new custom group
      await saveWodaDocument(customData.id);
    } catch (error) {
      console.error("Error creating custom group:", error);
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to create custom group",
        color: "red",
      });
    }
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
      title="Woda Documents Form"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>


        <Stack gap="md">
          {/* Applicant Personal Details */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="sm">Applicant Details</Text>
            <SimpleGrid cols={2} spacing="xs">
              <Select
                label="Applicant Gender"
                description="Applicant Gender"
                placeholder="e.g. Male, Female"
                data={["Male", "Female"]}
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
              mt="sm"
              {...form.getInputProps("applicant_name")}
            />
            <TextInput
              label="Permanent Address"
              description="Full Permanent Address"
              placeholder="e.g. Thakurbaba Municipality, Ward No 8, Bardiya, Lumbini Province, Nepal"
              mt="sm"
              {...form.getInputProps("applicant_permanent_address")}
            />

            <SimpleGrid cols={2} spacing="xs" mt="sm">
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
                    form.setFieldValue("applicant_dob", null);
                  }
                }}
              />
              <TextInput
                readOnly
                label="Date of Birth (B.S.)"
                description="Applicant's Date of Birth"
                placeholder="Auto-filled"
                {...form.getInputProps("applicant_dob_bs")}
              />
            </SimpleGrid>

            <TextInput
              label="Birth Address"
              description="Birth Address of the Applicant"
              placeholder="e.g. Geruwa Rural Municipality, Ward No. 1, Bardiya, Lumbini Province, Nepal"
              mt="sm"
              {...form.getInputProps("applicant_birth_address")}
            />

            <SimpleGrid cols={2} spacing="xs" mt="sm">
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

            <Divider my="md" />

            <Text size="xs" fw={600} tt="uppercase" mb="sm">Guardian Details</Text>

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
                  placeholder="e.g. Jane Doe"
                  {...form.getInputProps("applicant_mother_name")}
                />
              </Grid.Col>
            </Grid>
          </div>

          <Divider />

          {/* Document Info */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="sm">Document Info</Text>
            <SimpleGrid cols={2} spacing="xs">
              <TextInput
                label="Document Reference No."
                description="Reference No. for Woda Docs"
                placeholder="e.g. xxxx/xx"
                {...form.getInputProps("wodadoc_refno")}
              />
              <DateInput
                label="Document Date"
                description="Date for Woda Docs"
                placeholder="Select Date"
                {...form.getInputProps("wodadoc_date")}
              />
            </SimpleGrid>
          </div>

          <Divider />

          {/* Spokesperson Details */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="sm">Spokesperson Details</Text>
            <SimpleGrid cols={1} spacing="xs">
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
          </div>

          <Divider />

          {/* Relationship Verification */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="sm">Relationship Verification Certificate</Text>
            <Textarea
              rows={6}
              placeholder="e.g. Local Government Operation Act..."
              {...form.getInputProps("signature_issued_act_relationship")}
            />

            <Divider my="md" />

            <Group>
              <Switch checked={form.values.extra_relation} {...form.getInputProps("extra_relation")} />
              <Text size="xs" fw={600}>Extra Personnel</Text>
            </Group>

            <SimpleGrid cols={3} spacing="xs" mt="sm">
              <TextInput
                label="Honorific"
                placeholder="Mr / Mrs / Miss"
                disabled={!form.values.extra_relation}
                {...form.getInputProps("relation_extra_honorific")}
              />
              <TextInput
                label="Full Name"
                placeholder="Ramesh Govind"
                disabled={!form.values.extra_relation}
                {...form.getInputProps("relation_extra_name")}
              />
              <TextInput
                label="Relation"
                placeholder="Applicant's Brother"
                disabled={!form.values.extra_relation}
                {...form.getInputProps("relation_extra_relation")}
              />
            </SimpleGrid>
          </div>

          <Divider />

          {/* Fiscal Year */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="sm">Fiscal Year Details</Text>
            {[1, 2, 3].map((year) => (
              <div key={year}>
                <Text size="xs" fw={600} tt="uppercase" mb="sm">Year {year}</Text>
                <SimpleGrid cols={2} spacing="xs" mb="md">
                  <TextInput
                    placeholder="e.g. 2079/2080"
                    {...form.getInputProps(`fiscal_${year}_bs`)}
                  />
                  <TextInput
                    placeholder="e.g. 2022/2023"
                    {...form.getInputProps(`fiscal_${year}_ad`)}
                  />
                </SimpleGrid>
                <Textarea
                  rows={3}
                  placeholder="Select Template"
                  mb="sm"
                  {...form.getInputProps(`fiscal_fullfiscal_${year}`)}
                />
                {year < 3 && <Divider my="md" />}
              </div>
            ))}
          </div>

          <Divider />

          {/* Occupation */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="sm">Occupation Details</Text>
            <Select
              label="Earning Guardian"
              placeholder="Select Guardian"
              data={[
                { value: "father", label: "Father" },
                { value: "mother", label: "Mother" },
              ]}
              {...form.getInputProps("applicant_earning_guardian")}
            />

            <Divider my="md" />

            <Group justify="space-between">
              <Text size="xs" fw={600} tt="uppercase">Occupations</Text>
              <Button
                leftSection={<PlusIcon />}
                size="xs"
                variant="light"
                onClick={() => form.insertListItem("occupations", { name: "", income1: 0, income2: 0, income3: 0 })}
              >
                Add Occupation
              </Button>
            </Group>

            <Grid gutter="xs" opacity={0.5} mt="sm">
              <Grid.Col span={5}><Text size="10px" tt="uppercase" fw={600}>Name</Text></Grid.Col>
              <Grid.Col span={2}><Text size="10px" tt="uppercase" fw={600}>Y1</Text></Grid.Col>
              <Grid.Col span={2}><Text size="10px" tt="uppercase" fw={600}>Y2</Text></Grid.Col>
              <Grid.Col span={2}><Text size="10px" tt="uppercase" fw={600}>Y3</Text></Grid.Col>
            </Grid>

            {form.values.occupations.map((_, index) => (
              <Grid key={index} gutter="xs">
                <Grid.Col span={5}>
                  <TextInput
                    placeholder="Occupation Name"
                    {...form.getInputProps(`occupations.${index}.name`)}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <NumberInput hideControls {...form.getInputProps(`occupations.${index}.income1`)} />
                </Grid.Col>
                <Grid.Col span={2}>
                  <NumberInput hideControls {...form.getInputProps(`occupations.${index}.income2`)} />
                </Grid.Col>
                <Grid.Col span={2}>
                  <NumberInput hideControls {...form.getInputProps(`occupations.${index}.income3`)} />
                </Grid.Col>
                <Grid.Col span={1}>
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => form.removeListItem("occupations", index)}
                  >
                    <TrashIcon size={16} />
                  </ActionIcon>
                </Grid.Col>
              </Grid>
            ))}

            <Divider my="md" />

            <Textarea
              rows={6}
              placeholder="End Note..."
              {...form.getInputProps("occupation_note")}
            />
          </div>

          <Divider />

          {/* Date of Birth Verification */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="sm">Date of Birth Verification</Text>
            <Textarea
              rows={6}
              placeholder="e.g. Local Government Operation Act..."
              {...form.getInputProps("signature_issued_act_dob")}
            />
          </div>

          <Divider />

          {/* Income Details */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="sm">Income & Conversion Details</Text>
            <SimpleGrid cols={2} spacing="xs">
              <NumberInput
                label="USD Conversion Rate"
                placeholder="e.g. 133.58"
                {...form.getInputProps("usd_rate")}
              />
              <DateInput
                label="Conversion Rate Date"
                placeholder="Select Date"
                {...form.getInputProps("rate_date")}
              />
            </SimpleGrid>
          </div>

          <Divider />

          {/* Tax Details */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="sm">Tax Clearance Details</Text>
            <SimpleGrid cols={2} spacing="xs" mb="md">
              <NumberInput
                label="TAX Rate"
                placeholder="e.g. 133.58"
                {...form.getInputProps("tax")}
              />
              <TextInput
                label="TAX Clearance Issuer"
                placeholder="e.g. Thakurba Municipality"
                {...form.getInputProps("tax_clearance_issuer")}
              />
            </SimpleGrid>

            <Textarea
              rows={6}
              placeholder="TAX Clearance Signature..."
              {...form.getInputProps("signature_tax")}
            />
          </div>

          <Divider />

          {/* Migration Details */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="sm">Migration Certificate</Text>
            <SimpleGrid cols={2} spacing="xs" mb="md">
              <TextInput
                label="Initial Address"
                placeholder="e.g. Bannatoli Village..."
                {...form.getInputProps("initial_address")}
              />
              <DateInput
                label="Migration Date"
                placeholder="Select Date"
                {...form.getInputProps("migration_date")}
              />
            </SimpleGrid>

            <Textarea
              rows={6}
              placeholder="e.g. along with her parent"
              {...form.getInputProps("signature_migration_alongwith")}
            />
          </div>

          <Divider />

          {/* Surname Verification */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="sm">Surname Verification</Text>
            <SimpleGrid cols={2} spacing="xs">
              <TextInput
                label="Surname Compared With"
                placeholder="e.g. her and her parent's surnames"
                {...form.getInputProps("applicant_surname_reference")}
              />
              <TextInput
                label="Parent's Surname"
                placeholder="e.g. Thapa Magar"
                {...form.getInputProps("applicant_parents_surname")}
              />
            </SimpleGrid>
            <TextInput
              label="Applicant's Surname"
              placeholder="e.g. Thapa"
              mt="sm"
              {...form.getInputProps("applicant_surname")}
            />
          </div>

          <Divider />

          {/* Address Change Certificate */}
          <div>
            <Text size="xs" fw={600} tt="uppercase" mb="sm">Address Change Certificate</Text>
            <TextInput
              label="Initial Address Name"
              placeholder="e.g. Bannatoli Village..."
              mb="sm"
              {...form.getInputProps("initial_address_name")}
            />

            <SimpleGrid cols={2} spacing="xs">
              <DateInput
                label="Address Change Date"
                placeholder="Select Date"
                {...form.getInputProps("address_name_change_date")}
              />
              <TextInput
                readOnly
                label="Change Date (B.S.)"
                placeholder="Auto-filled"
                {...form.getInputProps("address_name_change_date_bs")}
              />
            </SimpleGrid>
          </div>

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
        title="Save Document as?"
        centered
      >
        <Box p="md">
          <Stack gap="md">
            <TextInput
              label="Document Name"
              placeholder="e.g. Ramesh Full Documents"
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
              Create
              </Button>
            </Group>
          </Stack>
        </Box>
      </Modal>
    </Drawer>
  );
}
