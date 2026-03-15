"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  Stack,
  TextInput,
  Select,
  Button,
  Group,
  Divider,
  SimpleGrid,
  Text,
  Modal,
  Box,
  Textarea,
  ActionIcon,
  Table,
  NumberInput,
  Stepper,
  ScrollArea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useDocContext, StudentCertificateData } from "@/context/DocumentContext";
import { notifications } from "@mantine/notifications";
import { moduleApiCall } from "@settle/core";

interface StudentCertificateDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function StudentCertificateDrawer({ opened, onClose }: StudentCertificateDrawerProps) {
  const { documentData, setDocumentData, studentId, customGroupId, setCustomGroupId } = useDocContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomGroupModal, setShowCustomGroupModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [batchDetail, setBatchDetail] = useState<any>(null);

  const grades = ["A", "B", "C", "D"];

  const customGroupForm = useForm({
    initialValues: {
      name: "",
      description: "",
    },
  });

  const form = useForm({
    initialValues: {
      // Step 1: Basic Info
      firstname: documentData?.firstname || "",
      middlename: documentData?.middlename || "",
      lastname: documentData?.lastname || "",
      date_of_birth: documentData?.date_of_birth ? new Date(documentData.date_of_birth) : null,
      gender: documentData?.gender || "Male",
      current_address: documentData?.address || "",
      permanent_address: documentData?.address || "",

      // Step 2: Contact Info
      email: "",
      contact: "",
      phone_number: "",
      emergency_contact_name: "",
      emergency_contact_relation: "",
      emergency_contact_phone: "",

      // Step 3: Background (optional arrays)
      experiences: [] as any[],
      educations: [] as any[],
      family_members: [] as any[],

      // Step 4: Enrollment & Academic
      batch_name: documentData?.batch?.course?.name || "",
      batch_shift: "",
      batch_course: documentData?.batch?.course?.level || "",
      batch_books: documentData?.batch?.course?.books || [],
      batch_instructor: documentData?.batch?.instructor?.[0]?.name || "",
      batch_total_days: documentData?.batch?.course?.total_days || 0,
      batch_per_class_hours: documentData?.coursehour || 0,

      date_of_admission: documentData?.date_of_admission ? new Date(documentData.date_of_admission) : null,
      date_of_completion: documentData?.date_of_completion ? new Date(documentData.date_of_completion) : null,
      issue_date: documentData?.issue ? new Date(documentData.issue) : null,

      grammar: documentData?.grammar || "A",
      listening: documentData?.listening || "A",
      conversation: documentData?.conversation || "A",
      reading: documentData?.reading || "A",
      composition: documentData?.composition || "A",
      grading_remarks: "",

      marking_start_date: null as Date | null,
      markings: documentData?.marking || [],

      // Additional Certificate Info
      studyType: documentData?.studyType || 0,
      customBranch: documentData?.customBranch || "",
      customBranchNo: documentData?.customBranchNo || "",
    },
  });

  // Fetch student batch details when drawer opens
  useEffect(() => {
    if (opened && studentId) {
      const fetchStudentBatch = async () => {
        try {
          const studentData = await moduleApiCall.getSingleRecord({
            endpoint: "/api/students/",
            id: studentId,
          });
          if (studentData?.batch_detail) {
            setBatchDetail(studentData.batch_detail);
            // Auto-populate batch fields from student data
            form.setValues((prev) => ({
              ...prev,
              batch_name: studentData.batch_detail.name || "",
              batch_shift: studentData.batch_detail.shift || "",
              batch_course: studentData.batch_detail.course || "",
              batch_books: [{ name: studentData.batch_detail.books }] || [],
              batch_instructor: studentData.batch_detail.instructor || "",
              batch_total_days: studentData.batch_detail.total_days || 0,
              batch_per_class_hours: parseFloat(studentData.batch_detail.per_class_hours) || 0,
            }));
          }
        } catch (error) {
          console.error("Error fetching student batch details:", error);
        }
      };
      fetchStudentBatch();
    }
  }, [opened, studentId]);

  useEffect(() => {
    if (opened && documentData) {
      form.setValues({
        firstname: documentData.firstname || "",
        middlename: documentData.middlename || "",
        lastname: documentData.lastname || "",
        date_of_birth: documentData.date_of_birth ? new Date(documentData.date_of_birth) : null,
        gender: documentData.gender || "Male",
        current_address: documentData.address || "",
        permanent_address: documentData.address || "",
        email: "",
        contact: "",
        phone_number: "",
        emergency_contact_name: "",
        emergency_contact_relation: "",
        emergency_contact_phone: "",
        experiences: [],
        educations: [],
        family_members: [],
        batch_name: documentData.batch?.course?.name || "",
        batch_shift: "",
        batch_course: documentData.batch?.course?.level || "",
        batch_books: documentData.batch?.course?.books || [],
        batch_instructor: documentData.batch?.instructor?.[0]?.name || "",
        batch_total_days: documentData.batch?.course?.total_days || 0,
        batch_per_class_hours: documentData.coursehour || 0,
        date_of_admission: documentData.date_of_admission ? new Date(documentData.date_of_admission) : null,
        date_of_completion: documentData.date_of_completion ? new Date(documentData.date_of_completion) : null,
        issue_date: documentData.issue ? new Date(documentData.issue) : null,
        grammar: documentData.grammar || "A",
        listening: documentData.listening || "A",
        conversation: documentData.conversation || "A",
        reading: documentData.reading || "A",
        composition: documentData.composition || "A",
        grading_remarks: "",
        marking_start_date: null,
        markings: documentData.marking || [],
        studyType: documentData.studyType || 0,
        customBranch: documentData.customBranch || "",
        customBranchNo: documentData.customBranchNo || "",
      });
      setActiveStep(0);
    } else if (opened) {
      form.reset();
      setActiveStep(0);
    }
  }, [opened]);

  const handleSubmit = async () => {
    if (!studentId && !customGroupId) {
      setShowCustomGroupModal(true);
      return;
    }

    await saveStudentCertificate(customGroupId);
  };

  const saveStudentCertificate = async (customId: number | null) => {
    setIsLoading(true);
    try {
      const certificateData: StudentCertificateData = {
        firstname: form.values.firstname,
        middlename: form.values.middlename,
        lastname: form.values.lastname,
        date_of_birth: form.values.date_of_birth ? form.values.date_of_birth.toISOString() : "",
        gender: form.values.gender as "Male" | "Female",
        address: form.values.current_address,
        date_of_admission: form.values.date_of_admission ? form.values.date_of_admission.toISOString() : "",
        date_of_completion: form.values.date_of_completion ? form.values.date_of_completion.toISOString() : "",
        issue: form.values.issue_date ? form.values.issue_date.toISOString() : "",
        coursehour: form.values.batch_per_class_hours,
        grammar: form.values.grammar as "A" | "B" | "C" | "D",
        listening: form.values.listening as "A" | "B" | "C" | "D",
        conversation: form.values.conversation as "A" | "B" | "C" | "D",
        reading: form.values.reading as "A" | "B" | "C" | "D",
        composition: form.values.composition as "A" | "B" | "C" | "D",
        studyType: form.values.studyType as 0 | 1,
        customBranch: form.values.customBranch,
        customBranchNo: form.values.customBranchNo,
        batch: {
          course: {
            name: form.values.batch_name,
            level: form.values.batch_course,
            total_days: form.values.batch_total_days,
            books: form.values.batch_books,
          },
          instructor: form.values.batch_instructor ? [{ name: form.values.batch_instructor }] : [],
        },
        marking: form.values.markings,
      };

      // Update local context
      setDocumentData(certificateData);

      notifications.show({
        title: "Success",
        message: "Student certificate saved successfully",
        color: "green",
      });

      form.reset();
      onClose();
    } catch (error) {
      console.error("Error saving certificate:", error);
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to save certificate",
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
      setCustomGroupId(customData.id);
      await saveStudentCertificate(customData.id);
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
    <>
      <Drawer
        opened={opened}
        onClose={() => {
          form.reset();
          onClose();
          setActiveStep(0);
        }}
        position="right"
        size="lg"
        title="Student Certificate Form"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md" h="100%">
            <Stepper active={activeStep} onStepClick={setActiveStep} allowNextStepsSelect={false}>
              <Stepper.Step label="Basic Info" description="Personal details">
                <Stack gap="md" mt="md">
                  <SimpleGrid cols={3} spacing="xs">
                    <TextInput
                      label="First Name"
                      placeholder="e.g. John"
                      required
                      {...form.getInputProps("firstname")}
                    />
                    <TextInput
                      label="Middle Name"
                      placeholder="e.g. Kumar"
                      {...form.getInputProps("middlename")}
                    />
                    <TextInput
                      label="Last Name"
                      placeholder="e.g. Doe"
                      required
                      {...form.getInputProps("lastname")}
                    />
                  </SimpleGrid>

                  <SimpleGrid cols={2} spacing="xs">
                    <DateInput
                      label="Date of Birth"
                      placeholder="Select Date"
                      {...form.getInputProps("date_of_birth")}
                    />
                    <Select
                      label="Gender"
                      data={["Male", "Female"]}
                      {...form.getInputProps("gender")}
                    />
                  </SimpleGrid>

                  <TextInput
                    label="Current Address"
                    placeholder="e.g. Kathmandu, Nepal"
                    {...form.getInputProps("current_address")}
                  />

                  <TextInput
                    label="Permanent Address"
                    placeholder="e.g. Kathmandu, Nepal"
                    {...form.getInputProps("permanent_address")}
                  />
                </Stack>
              </Stepper.Step>

              <Stepper.Step label="Contact Info" description="Contact details">
                <Stack gap="md" mt="md">
                  <TextInput
                    label="Email"
                    type="email"
                    placeholder="e.g. student@example.com"
                    {...form.getInputProps("email")}
                  />

                  <SimpleGrid cols={2} spacing="xs">
                    <TextInput
                      label="Contact / Phone"
                      placeholder="e.g. 9841234567"
                      {...form.getInputProps("contact")}
                    />
                    <TextInput
                      label="Phone Number"
                      placeholder="e.g. 9841234567"
                      {...form.getInputProps("phone_number")}
                    />
                  </SimpleGrid>

                  <Divider label="Emergency Contact" />

                  <TextInput
                    label="Emergency Contact Name"
                    placeholder="e.g. Parent Name"
                    {...form.getInputProps("emergency_contact_name")}
                  />

                  <SimpleGrid cols={2} spacing="xs">
                    <TextInput
                      label="Relation"
                      placeholder="e.g. Parent"
                      {...form.getInputProps("emergency_contact_relation")}
                    />
                    <TextInput
                      label="Phone Number"
                      placeholder="e.g. 9841234567"
                      {...form.getInputProps("emergency_contact_phone")}
                    />
                  </SimpleGrid>
                </Stack>
              </Stepper.Step>

              <Stepper.Step label="Course Details" description="Batch & Course info">
                <Stack gap="md" mt="md">
                  {batchDetail && (
                    <>
                      <Box bg="blue.0" p="sm" radius="md" mb="md">
                        <Text size="sm" fw={600} mb="xs">Batch Information (from Student Record)</Text>
                        <SimpleGrid cols={2} spacing="xs">
                          <div>
                            <Text size="xs" c="dimmed">Batch Name</Text>
                            <Text size="sm" fw={500}>{batchDetail.name}</Text>
                          </div>
                          <div>
                            <Text size="xs" c="dimmed">Shift</Text>
                            <Text size="sm" fw={500}>{batchDetail.shift}</Text>
                          </div>
                          <div>
                            <Text size="xs" c="dimmed">Course</Text>
                            <Text size="sm" fw={500}>{batchDetail.course}</Text>
                          </div>
                          <div>
                            <Text size="xs" c="dimmed">Instructor</Text>
                            <Text size="sm" fw={500}>{batchDetail.instructor}</Text>
                          </div>
                          <div>
                            <Text size="xs" c="dimmed">Books</Text>
                            <Text size="sm" fw={500}>{batchDetail.books}</Text>
                          </div>
                          <div>
                            <Text size="xs" c="dimmed">Total Days</Text>
                            <Text size="sm" fw={500}>{batchDetail.total_days}</Text>
                          </div>
                          <div>
                            <Text size="xs" c="dimmed">Hours per Day</Text>
                            <Text size="sm" fw={500}>{batchDetail.per_class_hours}</Text>
                          </div>
                        </SimpleGrid>
                      </Box>
                      <Divider label="Edit Batch Details (if needed)" />
                    </>
                  )}

                  <SimpleGrid cols={2} spacing="xs">
                    <TextInput
                      label="Batch Name"
                      placeholder="e.g. Japanese 2024-01"
                      {...form.getInputProps("batch_name")}
                    />
                    <TextInput
                      label="Shift"
                      placeholder="e.g. Morning"
                      {...form.getInputProps("batch_shift")}
                    />
                  </SimpleGrid>

                  <SimpleGrid cols={2} spacing="xs">
                    <TextInput
                      label="Course Level"
                      placeholder="e.g. Beginner"
                      {...form.getInputProps("batch_course")}
                    />
                    <NumberInput
                      label="Course Hours per Day"
                      placeholder="e.g. 4"
                      {...form.getInputProps("batch_per_class_hours")}
                    />
                  </SimpleGrid>

                  <SimpleGrid cols={2} spacing="xs">
                    <NumberInput
                      label="Total Days"
                      placeholder="e.g. 30"
                      {...form.getInputProps("batch_total_days")}
                    />
                    <TextInput
                      label="Instructor Name"
                      placeholder="e.g. Taro Yamamoto"
                      {...form.getInputProps("batch_instructor")}
                    />
                  </SimpleGrid>

                  <TextInput
                    label="Books (comma separated)"
                    placeholder="e.g. Book1, Book2, Book3"
                    {...form.getInputProps("batch_books")}
                  />
                </Stack>
              </Stepper.Step>

              <Stepper.Step label="Enrollment & Grading" description="Dates & grades">
                <Stack gap="md" mt="md">
                  <div>
                    <Text size="xs" fw={600} tt="uppercase" mb="sm">Important Dates</Text>
                    <SimpleGrid cols={3} spacing="xs">
                      <DateInput
                        label="Admission Date"
                        placeholder="Select Date"
                        {...form.getInputProps("date_of_admission")}
                      />
                      <DateInput
                        label="Completion Date"
                        placeholder="Select Date"
                        {...form.getInputProps("date_of_completion")}
                      />
                      <DateInput
                        label="Issue Date"
                        placeholder="Select Date"
                        {...form.getInputProps("issue_date")}
                      />
                    </SimpleGrid>
                  </div>

                  <Divider />

                  <div>
                    <Text size="xs" fw={600} tt="uppercase" mb="sm">Grading Evaluation</Text>
                    <SimpleGrid cols={2} spacing="md">
                      {["grammar", "listening", "conversation", "reading", "composition"].map((gradeField) => (
                        <Select
                          key={gradeField}
                          label={gradeField.charAt(0).toUpperCase() + gradeField.slice(1)}
                          data={grades}
                          {...form.getInputProps(gradeField)}
                        />
                      ))}
                    </SimpleGrid>
                  </div>

                  <Textarea
                    label="Grading Remarks"
                    placeholder="Additional remarks..."
                    rows={3}
                    {...form.getInputProps("grading_remarks")}
                  />

                  <Divider />

                  <Select
                    label="Study Status"
                    data={[
                      { value: "0", label: "Currently Studying" },
                      { value: "1", label: "Completed" },
                    ]}
                    value={form.values.studyType.toString()}
                    onChange={(val) => form.setFieldValue("studyType", val === "1" ? 1 : 0)}
                  />

                  <Divider />

                  <div>
                    <Text size="xs" fw={600} tt="uppercase" mb="sm">Branch Information</Text>
                    <SimpleGrid cols={2} spacing="xs">
                      <TextInput
                        label="Custom Branch Name"
                        placeholder="e.g. Chitwan Branch"
                        {...form.getInputProps("customBranch")}
                      />
                      <TextInput
                        label="Branch Phone/Contact"
                        placeholder="e.g. 056-500000"
                        {...form.getInputProps("customBranchNo")}
                      />
                    </SimpleGrid>
                  </div>
                </Stack>
              </Stepper.Step>

              <Stepper.Step label="Review" description="Review all information">
                <Stack gap="md" mt="md">
                  <Text size="sm" fw={600}>Personal Information</Text>
                  <Box bg="gray.1" p="sm" radius="md">
                    <Text size="xs">{form.values.firstname} {form.values.middlename} {form.values.lastname}</Text>
                    <Text size="xs" c="dimmed">DOB: {form.values.date_of_birth?.toLocaleDateString()}</Text>
                    <Text size="xs" c="dimmed">Gender: {form.values.gender}</Text>
                  </Box>

                  <Text size="sm" fw={600}>Course Information</Text>
                  <Box bg="gray.1" p="sm" radius="md">
                    <Text size="xs">{form.values.batch_name} - {form.values.batch_course}</Text>
                    <Text size="xs" c="dimmed">Instructor: {form.values.batch_instructor}</Text>
                    <Text size="xs" c="dimmed">Period: {form.values.date_of_admission?.toLocaleDateString()} - {form.values.date_of_completion?.toLocaleDateString()}</Text>
                  </Box>

                  <Text size="sm" fw={600}>Grades</Text>
                  <Box bg="gray.1" p="sm" radius="md">
                    <SimpleGrid cols={3} spacing="xs">
                      <div><Text size="xs">Grammar: {form.values.grammar}</Text></div>
                      <div><Text size="xs">Listening: {form.values.listening}</Text></div>
                      <div><Text size="xs">Conversation: {form.values.conversation}</Text></div>
                      <div><Text size="xs">Reading: {form.values.reading}</Text></div>
                      <div><Text size="xs">Composition: {form.values.composition}</Text></div>
                    </SimpleGrid>
                  </Box>
                </Stack>
              </Stepper.Step>
            </Stepper>

            <Group justify="flex-end" mt="auto">
              <Button
                variant="light"
                onClick={() => {
                  form.reset();
                  onClose();
                  setActiveStep(0);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Group gap="xs">
                <Button
                  variant="light"
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0 || isLoading}
                >
                  Back
                </Button>
                {activeStep < 3 ? (
                  <Button
                    onClick={() => setActiveStep(activeStep + 1)}
                    disabled={isLoading}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" loading={isLoading} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Certificate"}
                  </Button>
                )}
              </Group>
            </Group>
          </Stack>
        </form>
      </Drawer>

      <Modal
        opened={showCustomGroupModal}
        onClose={() => {
          setShowCustomGroupModal(false);
          customGroupForm.reset();
        }}
        title="Save Certificate As?"
        centered
      >
        <Box p="md">
          <Stack gap="md">
            <TextInput
              label="Document Name"
              placeholder="e.g. Student Certificates"
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
    </>
  );
}
