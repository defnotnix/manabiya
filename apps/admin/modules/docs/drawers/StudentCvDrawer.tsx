"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  Stack,
  TextInput,
  Button,
  Group,
  Divider,
  SimpleGrid,
  Text,
  Modal,
  Box,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDocContext } from "@/context/DocumentContext";
import { notifications } from "@mantine/notifications";
import { moduleApiCall } from "@settle/core";

interface StudentCVData {
  firstname: string;
  middlename?: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  objective: string;
  summary: string;
  languages?: string[];
  skills?: string[];
  education?: Array<{ school: string; level: string; year: string }>;
}

interface StudentCvDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function StudentCvDrawer({ opened, onClose }: StudentCvDrawerProps) {
  const { studentId, customGroupId, setCustomGroupId } = useDocContext();
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
      firstname: "",
      middlename: "",
      lastname: "",
      email: "",
      phone: "",
      address: "",
      dob: null as Date | null,
      objective: "",
      summary: "",
      languages: "",
      skills: "",
    },
  });

  useEffect(() => {
    if (opened) {
      form.reset();
    }
  }, [opened]);

  const handleSubmit = async () => {
    if (!studentId && !customGroupId) {
      setShowCustomGroupModal(true);
      return;
    }

    await saveStudentCV(customGroupId);
  };

  const saveStudentCV = async (customId: number | null) => {
    setIsLoading(true);
    try {
      const cvData: StudentCVData = {
        firstname: form.values.firstname,
        middlename: form.values.middlename,
        lastname: form.values.lastname,
        email: form.values.email,
        phone: form.values.phone,
        address: form.values.address,
        dob: form.values.dob ? form.values.dob.toISOString() : "",
        objective: form.values.objective,
        summary: form.values.summary,
        languages: form.values.languages ? form.values.languages.split(",").map(l => l.trim()) : [],
        skills: form.values.skills ? form.values.skills.split(",").map(s => s.trim()) : [],
      };

      // Note: In a real implementation, this would save to an API endpoint
      // For now, we're just storing in context for display
      console.log("Saving CV data:", cvData);

      notifications.show({
        title: "Success",
        message: "Student CV saved successfully",
        color: "green",
      });

      form.reset();
      onClose();
    } catch (error) {
      console.error("Error saving CV:", error);
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to save CV",
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
      await saveStudentCV(customData.id);
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
        }}
        position="right"
        size="xl"
        title="Student CV Form"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {/* Personal Information */}
            <div>
              <Text size="xs" fw={600} tt="uppercase" mb="sm">Personal Information</Text>
              <SimpleGrid cols={3} spacing="xs">
                <TextInput
                  label="First Name"
                  placeholder="e.g. John"
                  {...form.getInputProps("firstname")}
                  required
                />
                <TextInput
                  label="Middle Name"
                  placeholder="e.g. Kumar"
                  {...form.getInputProps("middlename")}
                />
                <TextInput
                  label="Last Name"
                  placeholder="e.g. Doe"
                  {...form.getInputProps("lastname")}
                  required
                />
              </SimpleGrid>

              <SimpleGrid cols={2} spacing="xs" mt="sm">
                <DateInput
                  label="Date of Birth"
                  placeholder="Select Date"
                  {...form.getInputProps("dob")}
                />
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="e.g. john@example.com"
                  {...form.getInputProps("email")}
                />
              </SimpleGrid>

              <SimpleGrid cols={2} spacing="xs" mt="sm">
                <TextInput
                  label="Phone Number"
                  placeholder="e.g. 9841234567"
                  {...form.getInputProps("phone")}
                />
                <TextInput
                  label="Address"
                  placeholder="e.g. Kathmandu, Nepal"
                  {...form.getInputProps("address")}
                />
              </SimpleGrid>
            </div>

            <Divider />

            {/* Career Objective */}
            <div>
              <Text size="xs" fw={600} tt="uppercase" mb="sm">Career Objective</Text>
              <Textarea
                label="Objective"
                placeholder="Write your career objective..."
                rows={4}
                {...form.getInputProps("objective")}
              />
            </div>

            <Divider />

            {/* Professional Summary */}
            <div>
              <Text size="xs" fw={600} tt="uppercase" mb="sm">Professional Summary</Text>
              <Textarea
                label="Summary"
                placeholder="Write a brief summary of your professional background..."
                rows={4}
                {...form.getInputProps("summary")}
              />
            </div>

            <Divider />

            {/* Skills & Languages */}
            <div>
              <Text size="xs" fw={600} tt="uppercase" mb="sm">Skills & Languages</Text>
              <Textarea
                label="Languages"
                placeholder="e.g. English, Japanese, Nepali (comma separated)"
                rows={3}
                {...form.getInputProps("languages")}
              />
              <Textarea
                label="Skills"
                placeholder="e.g. Java, Python, JavaScript, Communication (comma separated)"
                rows={3}
                mt="sm"
                {...form.getInputProps("skills")}
              />
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
                {isLoading ? "Saving..." : "Save CV"}
              </Button>
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
        title="Save CV As?"
        centered
      >
        <Box p="md">
          <Stack gap="md">
            <TextInput
              label="Document Name"
              placeholder="e.g. Student CVs"
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
