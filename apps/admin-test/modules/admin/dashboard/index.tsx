"use client";

import {
  ActionIcon,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  Brain,
  BrainIcon,
  GraphIcon,
  Image as ImageIcon,
  MagnifyingGlass,
  MagnifyingGlassIcon,
  Paperclip,
  PaperPlaneRight,
  PaperPlaneRightIcon,
  Sparkle,
  SparkleIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const phrases = ["for more", "for purpose", "framework"];

export function ModuleDashboard() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container
      size="xl"
      style={{
        height: "calc(100vh - 50px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <div /> {/* Spacer for flex alignment */}
      {/* Main Content Area - Centered */}
      <Stack
        align="center"
        justify="center"
        gap="xl"
        w="100%"
        style={{
          flex: 1,
        }}
      >
        {/* Animated Header Section */}
        <Stack align="center" gap={0} mb="xl">
          <SparkleIcon
            size={42}
            weight="fill"
            style={{ opacity: 0.9, marginBottom: 20 }}
          />
          <Text
            fw={900}
            ta="center"
            size="2.5rem"
            lh="1"
            style={{
              fontFamily: "Stack Sans Notch",
              letterSpacing: "-0.02em",
            }}
          >
            settle
          </Text>
          <Text
            fw={900}
            ta="center"
            size="2.5rem"
            lh="1"
            c="dimmed"
            style={{
              fontFamily: "Stack Sans Notch",
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.2em",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={phraseIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  display: "inline-block",
                  color:
                    phraseIndex == 2
                      ? "var(--mantine-color-brand-6)"
                      : "inherit",
                }}
              >
                {phrases[phraseIndex]}
              </motion.span>
            </AnimatePresence>
            .
          </Text>
        </Stack>

        {/* Chat Input Section */}
        <Stack w="100%" align="center" gap="md">
          <Paper
            radius="1.5rem"
            p="md"
            withBorder
            w="100%"
            maw={700}
            style={{
              backgroundColor: "var(--mantine-color-body)",
              borderColor: "var(--mantine-color-default-border)",
              transition: "all 0.2s ease",
              boxShadow:
                "0 10px 40px color-mix(in srgb, var(--mantine-color-brand-6), transparent 90%)",
            }}
          >
            <Stack gap="xs">
              <Group align="center" gap="sm" wrap="nowrap">
                <Text
                  fw={700}
                  size="xs"
                  c="dimmed"
                  style={{
                    border: "1px solid var(--mantine-color-default-border)",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    userSelect: "none",
                  }}
                >
                  v3
                </Text>
                <TextInput
                  variant="unstyled"
                  placeholder="Ask anything..."
                  style={{ flex: 1 }}
                  styles={{
                    input: {
                      fontSize: "var(--mantine-font-size-sm)",
                      fontWeight: 400,
                    },
                  }}
                />
              </Group>

              <Group justify="space-between" mt="sm">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  size="lg"
                  aria-label="Attach file"
                >
                  <Paperclip size={20} />
                </ActionIcon>
                <Group gap="xs">
                  <ActionIcon
                    variant="filled"
                    color="dark"
                    radius="xl"
                    size="lg"
                    aria-label="Send message"
                  >
                    <PaperPlaneRightIcon size={18} weight="fill" />
                  </ActionIcon>
                </Group>
              </Group>
            </Stack>
          </Paper>

          {/* Action Buttons */}
          <Group gap="sm" mt="xs" wrap="wrap" justify="center">
            <Button
              variant="default"
              radius="xl"
              size="xs"
              leftSection={<MagnifyingGlassIcon size={16} />}
              style={{ border: "none", backgroundColor: "transparent" }}
            >
              Deep Search
            </Button>
            <Button
              variant="default"
              radius="xl"
              size="xs"
              leftSection={<BrainIcon weight="fill" size={16} />}
              style={{ border: "none", backgroundColor: "transparent" }}
            >
              Think & Answer
            </Button>
            <Button
              variant="default"
              radius="xl"
              size="xs"
              leftSection={<GraphIcon weight="fill" size={16} />}
              style={{ border: "none", backgroundColor: "transparent" }}
            >
              Build Report
            </Button>
          </Group>
        </Stack>
      </Stack>
      {/* Footer */}
      <Group
        justify="space-between"
        w="100%"
        py="lg"
        px="xl"
        c="dimmed"
        style={{ fontSize: "0.8rem" }}
      >
        <Group gap="xl" visibleFrom="xs">
          <Group gap={6}>
            <Sparkle size={14} weight="fill" />
            <Text span inherit>
              Available 24/7
            </Text>
          </Group>
          <Group gap={6}>
            <Text span inherit>
              Securely Encrypted
            </Text>
          </Group>
          <Group gap={6}>
            <Text span inherit>
              For the people
            </Text>
          </Group>
        </Group>

        <Button
          variant="light"
          color="gray"
          rightSection={<MagnifyingGlass size={14} />}
          radius="xl"
          size="xs"
        >
          Explore
        </Button>
      </Group>
    </Container>
  );
}
