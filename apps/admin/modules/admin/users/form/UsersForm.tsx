"use client";

import {
  Stack,
  TextInput,
  Select,
  NumberInput,
  Group,
  Paper,
  Text,
  Grid,
  Divider,
  PasswordInput,
} from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { DateInput } from "@mantine/dates";

interface UsersFormProps {
  currentStep?: number;
  isCreate?: boolean;
}

export function UsersForm({
  currentStep = 0,
  isCreate = true,
}: UsersFormProps) {
  const form = FormWrapper.useForm();

  // Step 1: Identity & Account
  if (currentStep === 0) {
    return (
      <Stack gap="md" p="md">
        <Text fw={600} size="sm" c="dimmed">
          Personal Information
        </Text>
        <Group grow>
          <TextInput
            label="First Name"
            placeholder="John"
            {...form.getInputProps("firstName")}
            required
          />
          <TextInput
            label="Last Name"
            placeholder="Doe"
            {...form.getInputProps("lastName")}
            required
          />
        </Group>
        <Group grow>
          <TextInput
            label="Maiden Name"
            placeholder="Smith"
            {...form.getInputProps("maidenName")}
          />
          <NumberInput
            label="Age"
            placeholder="25"
            {...form.getInputProps("age")}
            min={0}
            max={120}
            required
          />
        </Group>
        <Group grow>
          <Select
            label="Gender"
            placeholder="Select gender"
            data={["male", "female", "other"]}
            {...form.getInputProps("gender")}
            required
          />
          {/* Using text input for date simplicity matching dummyjson format YYYY-MM-DD or similar */}
          <TextInput
            label="Birth Date"
            placeholder="YYYY-MM-DD"
            {...form.getInputProps("birthDate")}
            description="Format: YYYY-MM-DD"
          />
        </Group>

        <Divider my="xs" label="Account Details" labelPosition="center" />

        <Group grow>
          <TextInput
            label="Email"
            placeholder="john@example.com"
            {...form.getInputProps("email")}
            required
          />
          <TextInput
            label="Phone"
            placeholder="+1 123 456 7890"
            {...form.getInputProps("phone")}
            required
          />
        </Group>
        <Group grow>
          <TextInput
            label="Username"
            placeholder="johndoe"
            {...form.getInputProps("username")}
            required
          />
          {isCreate && (
            <PasswordInput
              label="Password"
              placeholder="Strong password"
              {...form.getInputProps("password")}
              required
            />
          )}
        </Group>
        <Select
          label="Role"
          placeholder="Select role"
          data={["admin", "moderator", "user"]}
          {...form.getInputProps("role")}
        />
      </Stack>
    );
  }

  // Step 2: Physical & Address
  if (currentStep === 1) {
    return (
      <Stack gap="md" p="md">
        <Text fw={600} size="sm" c="dimmed">
          Physical Attributes
        </Text>
        <Group grow>
          <NumberInput
            label="Height (cm)"
            placeholder="175"
            {...form.getInputProps("height")}
          />
          <NumberInput
            label="Weight (kg)"
            placeholder="70"
            {...form.getInputProps("weight")}
          />
        </Group>
        <Group grow>
          <TextInput
            label="Eye Color"
            placeholder="Brown"
            {...form.getInputProps("eyeColor")}
          />
          <TextInput
            label="Blood Group"
            placeholder="O+"
            {...form.getInputProps("bloodGroup")}
          />
        </Group>
        <Group grow>
          <TextInput
            label="Hair Color"
            placeholder="Black"
            {...form.getInputProps("hair.color")}
          />
          <TextInput
            label="Hair Type"
            placeholder="Straight"
            {...form.getInputProps("hair.type")}
          />
        </Group>

        <Divider my="xs" label="Address" labelPosition="center" />

        <TextInput
          label="Address Line"
          placeholder="123 Main St"
          {...form.getInputProps("address.address")}
          required
        />
        <Group grow>
          <TextInput
            label="City"
            placeholder="New York"
            {...form.getInputProps("address.city")}
            required
          />
          <TextInput
            label="State"
            placeholder="NY"
            {...form.getInputProps("address.state")}
          />
        </Group>
        <Group grow>
          <TextInput
            label="Postal Code"
            placeholder="10001"
            {...form.getInputProps("address.postalCode")}
          />
          <TextInput
            label="Country"
            placeholder="United States"
            {...form.getInputProps("address.country")}
          />
        </Group>
      </Stack>
    );
  }

  // Step 3: Employment & Bank
  if (currentStep === 2) {
    return (
      <Stack gap="md" p="md">
        <Text fw={600} size="sm" c="dimmed">
          Employment
        </Text>
        <TextInput
          label="University"
          placeholder="University of ..."
          {...form.getInputProps("university")}
        />

        <Group grow>
          <TextInput
            label="Company"
            placeholder="Acme Inc"
            {...form.getInputProps("company.name")}
            required
          />
          <TextInput
            label="Title"
            placeholder="Engineer"
            {...form.getInputProps("company.title")}
            required
          />
        </Group>
        <TextInput
          label="Department"
          placeholder="Engineering"
          {...form.getInputProps("company.department")}
        />

        <Divider my="xs" label="Bank Details" labelPosition="center" />

        <Group grow>
          <TextInput
            label="Card Number"
            placeholder="1234..."
            {...form.getInputProps("bank.cardNumber")}
          />
          <TextInput
            label="Card Type"
            placeholder="Visa"
            {...form.getInputProps("bank.cardType")}
          />
        </Group>
        <Group grow>
          <TextInput
            label="Expire"
            placeholder="MM/YY"
            {...form.getInputProps("bank.cardExpire")}
          />
          <TextInput
            label="Currency"
            placeholder="USD"
            {...form.getInputProps("bank.currency")}
          />
        </Group>
        <TextInput
          label="IBAN"
          placeholder="US123..."
          {...form.getInputProps("bank.iban")}
        />
      </Stack>
    );
  }

  // Final Step: Review
  return (
    <Stack gap="md" p="md">
      <Paper withBorder p="md">
        <Text fw={600} mb="sm">
          Review Information
        </Text>

        <Grid>
          <Grid.Col span={6}>
            <Text size="sm" fw={700}>
              Identity
            </Text>
            <Text size="sm">
              {form.values.firstName} {form.values.lastName}
            </Text>
            <Text size="sm">{form.values.email}</Text>
            <Text size="sm">{form.values.phone}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" fw={700}>
              Address
            </Text>
            <Text size="sm">{form.values.address.address}</Text>
            <Text size="sm">
              {form.values.address.city}, {form.values.address.state}
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" fw={700}>
              Employment
            </Text>
            <Text size="sm">
              {form.values.company.title} at {form.values.company.name}
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" fw={700}>
              Bank
            </Text>
            <Text size="sm">
              {form.values.bank.cardType} ending in{" "}
              {form.values.bank.cardNumber?.slice(-4)}
            </Text>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
}

export const STEPS = ["Identity", "Details", "Employment", "Review"];
