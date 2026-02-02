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
  Card,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { User, UserGear, Database } from "@phosphor-icons/react";
import { USER_TYPES, UserType } from "./form.config";
import { PollingStationMultiSelect } from "../../elections/data-entry-accounts/form/PollingStationMultiSelect";

interface UsersFormProps {
  currentStep?: number;
  isCreate?: boolean;
}

// Account status options
const ACCOUNT_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

// Status Select Component
function StatusSelect({ form }: { form: any }) {
  const currentStatus = form.values.is_disabled ? "disabled" : "active";

  const handleStatusChange = (value: string | null) => {
    if (value === "disabled") {
      form.setFieldValue("is_active", false);
      form.setFieldValue("is_disabled", true);
    } else {
      form.setFieldValue("is_active", true);
      form.setFieldValue("is_disabled", false);
    }
  };

  return (
    <Select
      label="Account Status"
      data={ACCOUNT_STATUS_OPTIONS}
      value={currentStatus}
      onChange={handleStatusChange}
      size="sm"
      mt="md"
    />
  );
}

// User Type Selection Card Component
function UserTypeCard({
  title,
  description,
  icon,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      withBorder
      padding="lg"
      style={{
        cursor: "pointer",
        borderColor: selected ? "var(--mantine-color-blue-6)" : undefined,
        backgroundColor: selected ? "var(--mantine-color-blue-0)" : undefined,
      }}
      onClick={onClick}
    >
      <Stack align="center" gap="sm">
        <ThemeIcon size="xl" variant={selected ? "filled" : "light"} color="blue">
          {icon}
        </ThemeIcon>
        <Text fw={600} size="sm">
          {title}
        </Text>
        <Text size="xs" c="dimmed" ta="center">
          {description}
        </Text>
      </Stack>
    </Card>
  );
}

export function UsersForm({
  currentStep = 0,
  isCreate = true,
}: UsersFormProps) {
  const form = FormWrapper.useForm();
  const userType = form.values.userType as UserType;

  // Step 0: User Type Selection
  if (currentStep === 0) {
    return (
      <Stack gap="md" p="md">
        <Text fw={600} size="sm" c="dimmed">
          Select User Type
        </Text>
        <Text size="xs" c="dimmed">
          Choose the type of user account you want to create
        </Text>
        <SimpleGrid cols={3} spacing="md" mt="md">
          <UserTypeCard
            title="Staff"
            description="Regular staff member with standard access"
            icon={<User size={24} />}
            selected={userType === USER_TYPES.STAFF}
            onClick={() => form.setFieldValue("userType", USER_TYPES.STAFF)}
          />
          <UserTypeCard
            title="Superuser"
            description="Administrator with full system access"
            icon={<UserGear size={24} />}
            selected={userType === USER_TYPES.SUPERUSER}
            onClick={() => form.setFieldValue("userType", USER_TYPES.SUPERUSER)}
          />
          <UserTypeCard
            title="Data Entry"
            description="Account for data entry with polling station access"
            icon={<Database size={24} />}
            selected={userType === USER_TYPES.DATA_ENTRY}
            onClick={() => form.setFieldValue("userType", USER_TYPES.DATA_ENTRY)}
          />
        </SimpleGrid>
        {form.errors.userType && (
          <Text size="xs" c="red">
            {form.errors.userType}
          </Text>
        )}
      </Stack>
    );
  }

  // For Data Entry users, show review at step 2 onwards (since they only have 2 form steps)
  if (userType === USER_TYPES.DATA_ENTRY && currentStep >= 2) {
    return (
      <Stack gap="md" p="md">
        <Paper withBorder p="md">
          <Text fw={600} mb="sm">
            Review Information
          </Text>
          <Grid>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Account Type
              </Text>
              <Text size="sm">Data Entry Account</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Username
              </Text>
              <Text size="sm">{form.values.username}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Polling Stations
              </Text>
              <Text size="sm">{form.values.polling_stations?.length || 0} selected</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Status
              </Text>
              <Text size="sm">
                {form.values.is_active ? "Active" : form.values.is_disabled ? "Disabled" : "Not Set"}
              </Text>
            </Grid.Col>
          </Grid>
        </Paper>
      </Stack>
    );
  }

  // For Data Entry users, show simplified form at step 1
  if (userType === USER_TYPES.DATA_ENTRY && currentStep === 1) {
    return (
      <Stack gap="md" p="md">
        <Text fw={600} size="sm" c="dimmed">
          Data Entry Account Details
        </Text>
        <TextInput
          label="Username"
          {...form.getInputProps("username")}
          withAsterisk
        />
        <PasswordInput
          label="Password"
          {...form.getInputProps("password")}
          withAsterisk
        />
        <PollingStationMultiSelect
          value={form.values.polling_stations || []}
          onChange={(val) => form.setFieldValue("polling_stations", val)}
          error={form.errors.polling_stations as string}
        />
        <Divider my="xs" label="Account Status" labelPosition="center" />
        <StatusSelect form={form} />
      </Stack>
    );
  }

  // Step 1: Identity & Account (for Staff/Superuser)
  if (currentStep === 1) {
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

        <Divider my="xs" label="Account Status" labelPosition="center" />
        <StatusSelect form={form} />
      </Stack>
    );
  }

  // Step 2: Physical & Address (for Staff/Superuser)
  if (currentStep === 2 && userType !== USER_TYPES.DATA_ENTRY) {
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

  // Step 3: Employment & Bank (for Staff/Superuser)
  if (currentStep === 3 && userType !== USER_TYPES.DATA_ENTRY) {
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

        {userType === USER_TYPES.DATA_ENTRY ? (
          // Data Entry Review
          <Grid>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Account Type
              </Text>
              <Text size="sm">Data Entry Account</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Username
              </Text>
              <Text size="sm">{form.values.username}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Polling Stations
              </Text>
              <Text size="sm">{form.values.polling_stations?.length || 0} selected</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Status
              </Text>
              <Text size="sm">
                {form.values.is_active ? "Active" : form.values.is_disabled ? "Disabled" : "Not Set"}
              </Text>
            </Grid.Col>
          </Grid>
        ) : (
          // Staff/Superuser Review
          <Grid>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Account Type
              </Text>
              <Text size="sm" style={{ textTransform: "capitalize" }}>
                {userType}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Status
              </Text>
              <Text size="sm">
                {form.values.is_active ? "Active" : form.values.is_disabled ? "Disabled" : "Not Set"}
              </Text>
            </Grid.Col>
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
              <Text size="sm">{form.values.address?.address}</Text>
              <Text size="sm">
                {form.values.address?.city}, {form.values.address?.state}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Employment
              </Text>
              <Text size="sm">
                {form.values.company?.title} at {form.values.company?.name}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Bank
              </Text>
              <Text size="sm">
                {form.values.bank?.cardType} ending in{" "}
                {form.values.bank?.cardNumber?.slice(-4)}
              </Text>
            </Grid.Col>
          </Grid>
        )}
      </Paper>
    </Stack>
  );
}

export const STEPS = ["User Type", "Identity", "Details", "Employment", "Review"];
