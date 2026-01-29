"use client";

import { useEffect, useState } from "react";
import {
  TextInput,
  Textarea,
  Select,
  Badge,
  Stack,
  Group,
  Text,
  NumberInput,
  Switch,
  MultiSelect,
  ColorInput,
  Slider,
  Paper,
  SimpleGrid,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { FormWrapper } from "@settle/core";
import { AGENDA_API } from "../module.api";

interface AgendaFormProps {
  currentStep?: number;
  isCreate?: boolean;
}

export function AgendaForm({ currentStep = 0, isCreate = true }: AgendaFormProps) {
  const form = FormWrapper.useForm();
  const [districts, setDistricts] = useState<any[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(true);

  // Fetch districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const districts = await AGENDA_API.getDistricts();
        setDistricts(Array.isArray(districts) ? districts : []);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
        setDistricts([]);
      } finally {
        setDistrictsLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  const districtOptions = districts.map((district) => ({
    value: district.id,
    label: district.name,
  }));

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  const categoryOptions = [
    { value: "infrastructure", label: "Infrastructure" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "environment", label: "Environment" },
    { value: "social", label: "Social Services" },
  ];

  const tagOptions = [
    { value: "budget", label: "Budget Related" },
    { value: "urgent", label: "Urgent" },
    { value: "review", label: "Needs Review" },
    { value: "approved", label: "Pre-Approved" },
    { value: "community", label: "Community Input" },
  ];

  // Step 1: Basic Information
  if (currentStep === 0) {
    return (
      <Stack gap="md" p="md">
        <TextInput
          label="Title"
          placeholder="Enter agenda title"
          {...form.getInputProps("title")}
          required
        />

        <Textarea
          label="Description"
          placeholder="Enter agenda description"
          minRows={4}
          {...form.getInputProps("description")}
          required
        />

        <SimpleGrid cols={2}>
          <Select
            label="District"
            placeholder="Select a district"
            data={districtOptions}
            searchable
            clearable
            {...form.getInputProps("district")}
            disabled={districtsLoading}
            required
          />

          <Select
            label="Status"
            placeholder="Select status"
            data={statusOptions}
            {...form.getInputProps("status")}
            required
          />
        </SimpleGrid>
      </Stack>
    );
  }

  // Step 2: Details & Configuration
  if (currentStep === 1) {
    return (
      <Stack gap="md" p="md">
        <SimpleGrid cols={2}>
          <Select
            label="Priority"
            placeholder="Select priority level"
            data={priorityOptions}
            {...form.getInputProps("priority")}
          />

          <Select
            label="Category"
            placeholder="Select category"
            data={categoryOptions}
            {...form.getInputProps("category")}
          />
        </SimpleGrid>

        <MultiSelect
          label="Tags"
          placeholder="Select relevant tags"
          data={tagOptions}
          {...form.getInputProps("tags")}
          clearable
        />

        <SimpleGrid cols={2}>
          <NumberInput
            label="Estimated Budget"
            placeholder="Enter budget amount"
            prefix="$"
            thousandSeparator=","
            {...form.getInputProps("budget")}
          />

          <NumberInput
            label="Estimated Duration (days)"
            placeholder="Enter duration"
            min={1}
            max={365}
            {...form.getInputProps("duration")}
          />
        </SimpleGrid>

        <SimpleGrid cols={2}>
          <DateInput
            label="Start Date"
            placeholder="Select start date"
            {...form.getInputProps("startDate")}
          />

          <DateInput
            label="End Date"
            placeholder="Select end date"
            {...form.getInputProps("endDate")}
          />
        </SimpleGrid>
      </Stack>
    );
  }

  // Step 3: Additional Settings
  if (currentStep === 2) {
    return (
      <Stack gap="md" p="md">
        <ColorInput
          label="Agenda Color"
          placeholder="Pick a color for this agenda"
          {...form.getInputProps("color")}
        />

        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Completion Progress
          </Text>
          <Slider
            marks={[
              { value: 0, label: "0%" },
              { value: 25, label: "25%" },
              { value: 50, label: "50%" },
              { value: 75, label: "75%" },
              { value: 100, label: "100%" },
            ]}
            {...form.getInputProps("progress")}
          />
        </Stack>

        <Paper withBorder p="md">
          <Stack gap="md">
            <Text size="sm" fw={600}>
              Notification Settings
            </Text>

            <Switch
              label="Enable email notifications"
              description="Receive updates about this agenda via email"
              {...form.getInputProps("emailNotifications", { type: "checkbox" })}
            />

            <Switch
              label="Enable SMS notifications"
              description="Receive urgent updates via SMS"
              {...form.getInputProps("smsNotifications", { type: "checkbox" })}
            />

            <Switch
              label="Public visibility"
              description="Make this agenda visible to the public"
              {...form.getInputProps("isPublic", { type: "checkbox" })}
            />
          </Stack>
        </Paper>

        <Textarea
          label="Internal Notes"
          placeholder="Add any internal notes or comments..."
          minRows={3}
          {...form.getInputProps("notes")}
        />
      </Stack>
    );
  }

  // Step 4: Review (shows summary)
  return (
    <Stack gap="md" p="md">
      <Text size="lg" fw={600}>
        Review Your Agenda
      </Text>

      <Paper withBorder p="md">
        <Stack gap="sm">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Title
            </Text>
            <Text size="sm" fw={500}>
              {form.getValues().title || "Not set"}
            </Text>
          </Group>

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Status
            </Text>
            <Badge>{form.getValues().status || "Not set"}</Badge>
          </Group>

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Priority
            </Text>
            <Badge
              color={
                form.getValues().priority === "urgent"
                  ? "red"
                  : form.getValues().priority === "high"
                    ? "orange"
                    : "blue"
              }
            >
              {form.getValues().priority || "Not set"}
            </Badge>
          </Group>

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Category
            </Text>
            <Text size="sm">{form.getValues().category || "Not set"}</Text>
          </Group>

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Budget
            </Text>
            <Text size="sm">
              {form.getValues().budget
                ? `$${form.getValues().budget.toLocaleString()}`
                : "Not set"}
            </Text>
          </Group>

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Public
            </Text>
            <Badge color={form.getValues().isPublic ? "green" : "gray"}>
              {form.getValues().isPublic ? "Yes" : "No"}
            </Badge>
          </Group>
        </Stack>
      </Paper>

      {form.getValues().description && (
        <Paper withBorder p="md">
          <Text size="sm" c="dimmed" mb="xs">
            Description
          </Text>
          <Text size="sm">{form.getValues().description}</Text>
        </Paper>
      )}

      {form.getValues().notes && (
        <Paper withBorder p="md">
          <Text size="sm" c="dimmed" mb="xs">
            Internal Notes
          </Text>
          <Text size="sm">{form.getValues().notes}</Text>
        </Paper>
      )}
    </Stack>
  );
}
