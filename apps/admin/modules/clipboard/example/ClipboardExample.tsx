"use client";

/**
 * Example usage of the Clipboard module
 * This shows how to integrate the clipboard with a form
 */

import { useState, useEffect } from "react";
import { Button, Paper, Stack, Text, TextInput, Box } from "@mantine/core";
import { useClipboardPanel } from "../hooks";
import { ClipboardPanel } from "../components";
import { Copy } from "@phosphor-icons/react";

/**
 * Example 1: Simple Clipboard Panel Integration
 */
export function SimpleClipboardExample() {
  const clipboard = useClipboardPanel();

  return (
    <Box>
      <Button onClick={clipboard.open} leftSection={<Copy size={16} />}>
        Open Clipboard
      </Button>

      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </Box>
  );
}

/**
 * Example 2: Auto-open when form opens
 */
interface FormWithClipboardProps {
  formOpened: boolean;
}

export function FormWithAutoClipboard({ formOpened }: FormWithClipboardProps) {
  const clipboard = useClipboardPanel();
  const [formData, setFormData] = useState({ name: "", address: "" });

  // Auto-open clipboard when form opens
  useEffect(() => {
    if (formOpened) {
      clipboard.open();
    }
  }, [formOpened, clipboard]);

  return (
    <>
      <Paper p="md" radius="md" withBorder>
        <Stack gap="md">
          <Text fw={500}>My Form</Text>

          <TextInput
            label="Full Name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
          />

          <TextInput
            label="Address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.currentTarget.value })}
          />

          <Button>Submit</Button>
        </Stack>
      </Paper>

      {/* Clipboard panel opens automatically when form is displayed */}
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}

/**
 * Example 3: Using with existing StatementDrawer or other forms
 */
export function DocumentFormWithClipboard() {
  const clipboard = useClipboardPanel();
  const [docFormOpened, setDocFormOpened] = useState(false);

  // Show clipboard when document form opens
  useEffect(() => {
    if (docFormOpened) {
      clipboard.open();
    } else {
      clipboard.close();
    }
  }, [docFormOpened, clipboard]);

  return (
    <Box>
      <Button onClick={() => setDocFormOpened(true)}>Open Document Form</Button>

      {docFormOpened && (
        <Paper p="md" radius="md" withBorder>
          <Stack gap="md">
            <Text fw={500}>Bank Statement Form</Text>
            <Text size="sm" c="dimmed">
              Use the clipboard panel on the right to quickly insert previously saved snippets
            </Text>
            {/* Your form fields here */}
            <Button onClick={() => setDocFormOpened(false)}>Close</Button>
          </Stack>
        </Paper>
      )}

      {/* Clipboard synced with form state */}
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </Box>
  );
}
