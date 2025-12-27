"use client";

import { useState } from "react";
import {
  Group,
  Button,
  Menu,
  Text,
  Stack,
  TextInput,
  Textarea,
  ActionIcon,
} from "@mantine/core";
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
  DotsThreeVerticalIcon,
} from "@phosphor-icons/react";
import { PropConfigShellCard, PropConfigField } from "../../ConfigShell.type";

export function ConfigShellCard({
  item,
  fields = [],
  idAccessor = "id",
  onEdit,
  onDelete,
  isEditing = false,
  onSave,
  onCancel,
}: PropConfigShellCard) {
  const [editedData, setEditedData] = useState(item);
  const [isInEditMode, setIsInEditMode] = useState(isEditing);

  const handleEdit = () => {
    setIsInEditMode(true);
  };

  const handleCancel = () => {
    setIsInEditMode(false);
    setEditedData(item);
    onCancel?.();
  };

  const handleSave = () => {
    onSave?.(editedData);
    setIsInEditMode(false);
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this item?")) {
      onDelete?.(item[idAccessor]);
    }
  };

  return (
    <Group
      justify="space-between"
      p="md"
      style={{ borderBottom: "1px solid #e0e0e0" }}
    >
      {isInEditMode ? (
        <Stack gap="sm" style={{ flex: 1 }}>
          <Group gap="sm" wrap="wrap">
            {fields.map((field) => {
              const value = editedData[field.name] || "";

              if (field.type === "textarea") {
                return (
                  <Textarea
                    key={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.currentTarget.value)
                    }
                    required={field.required}
                    style={{ flex: 1, minWidth: "200px" }}
                  />
                );
              }

              return (
                <TextInput
                  key={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  type={field.type || "text"}
                  value={value}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.currentTarget.value)
                  }
                  required={field.required}
                  style={{ flex: 1, minWidth: "150px" }}
                />
              );
            })}
          </Group>
        </Stack>
      ) : (
        <Group gap="md" style={{ flex: 1 }} align="center">
          <div style={{ flex: 1 }}>
            <Group gap="xs" align="center" wrap="wrap">
              {fields.map((field, index) => (
                <div key={index}>
                  <Text size="sm" fw={index == 0 ? 600 : 400}>
                    {editedData[field.name] || "-"}
                  </Text>
                </div>
              ))}
            </Group>
          </div>
        </Group>
      )}

      <Group gap={4}>
        {isInEditMode ? (
          <>
            <Button
              size="xs"
              variant="light"
              color="green"
              leftSection={<CheckIcon size={14} />}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              size="xs"
              variant="light"
              color="gray"
              leftSection={<XIcon size={14} />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="light" color="gray">
                <DotsThreeVerticalIcon size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<PencilIcon size={14} />}
                onClick={handleEdit}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                leftSection={<TrashIcon size={14} />}
                onClick={handleDelete}
                color="red"
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </Group>
  );
}
