"use client";

import { ScrollArea, Stack, Text } from "@mantine/core";
import { useNav } from "../../../context/NavContext";
import { NavElementRenderer } from "./NavElementRenderer";
import classes from "../Navbar.module.css";

export function NavPanel() {
  const { activeGroup } = useNav();

  if (!activeGroup) return null;

  return (
    <Stack
      h="100%"
      gap={0}
      className="nav-panel"
      style={{ flex: 1, minWidth: 0, overflow: "hidden" }}
    >
      {/* Module Content */}
      <ScrollArea className={classes.navScrollArea}>
        <Stack gap="xl" px={0} pb="md">
          {/* Gap between modules */}
          {activeGroup.modules.map((module) => (
            <Stack key={module.id} gap={0}>
              {module.showHeader && (
                <Text
                  fw={700}
                  size="xs"
                  c="dimmed"
                  tt="uppercase"
                  px="md"
                  mb="xs"
                >
                  {module.label}
                </Text>
              )}
              {/* Render Items */}
              <NavElementRenderer items={module.items} />
            </Stack>
          ))}
        </Stack>
      </ScrollArea>

      {/* Footer can go here if needed, or in the main shell */}
    </Stack>
  );
}
