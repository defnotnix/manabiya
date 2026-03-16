"use client";

import { useState } from "react";
import { ActionIcon, Badge, Tooltip } from "@mantine/core";
import { Copy } from "@phosphor-icons/react";
import { ClipboardPanel } from "./ClipboardPanel";
import styles from "./FloatingClipboardButton.module.css";

export function FloatingClipboardButton() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Tooltip label="Open Clipboard" position="left">
        <ActionIcon
          size="lg"
          radius="xl"
          className={styles.floatingButton}
          onClick={() => setOpened(true)}
          variant="filled"
          color="blue"
          aria-label="Open clipboard"
        >
          <div className={styles.buttonContent}>
            <Copy size={20} />
            <Badge size="xs" className={styles.badge}>
              📋
            </Badge>
          </div>
        </ActionIcon>
      </Tooltip>

      {/* Clipboard Drawer */}
      <ClipboardPanel opened={opened} onClose={() => setOpened(false)} />
    </>
  );
}
