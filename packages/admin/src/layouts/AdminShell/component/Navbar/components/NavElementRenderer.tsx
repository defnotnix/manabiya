"use client";
import { Divider, Text } from "@mantine/core";
import { NavElement } from "../../../AdminShell.nav.types";
import { NavLinkItem } from "./NavLinkItem";

interface NavElementRendererProps {
  items: NavElement[];
  isChild?: boolean;
}

export function NavElementRenderer({
  items,
  isChild = false,
}: NavElementRendererProps) {
  return (
    <>
      {items.map((item, index) => {
        const key = item.id || `${item.type}-${index}`;

        switch (item.type) {
          case "link":
            // NavLinkItem now handles its own children recursively inside Mantine's NavLink
            return (
              <NavLinkItem key={key} item={item} isChild={isChild} depth={0} />
            );

          case "divider":
            if (item.label) {
              return (
                <div key={key}>
                  <Divider my={item.margin || "xs"} />
                  <Text
                    fw={800}
                    tt="uppercase"
                    size="10px"
                    c="dimmed"
                    px="md"
                    pb="xs"
                  >
                    {item.label}
                  </Text>
                </div>
              );
            }
            return <Divider key={key} my={item.margin || "xs"} />;

          case "header":
            return (
              <Text
                key={key}
                fw={600}
                size="10px"
                c="brand"
                mt="md"
                mb="xs"
                px="md"
              >
                {item.label}
              </Text>
            );

          case "action":
            // TODO: Implement action item
            return null;

          case "custom":
            return <div key={key}>{item.render()}</div>;

          default:
            return null;
        }
      })}
    </>
  );
}
