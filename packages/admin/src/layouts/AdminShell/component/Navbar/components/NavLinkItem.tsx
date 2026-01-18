"use client";
import { NavLink, Highlight, Divider, Text } from "@mantine/core";
import { LineVerticalIcon } from "@phosphor-icons/react";
import { useHover } from "@mantine/hooks";
import { usePathname, useRouter } from "next/navigation";
import { NavElement, NavItemLink } from "../../../AdminShell.nav.types";
import { useNav } from "../../../context/NavContext";
import classesNavLink from "../Navbar.NavLink.module.css";

interface NavLinkItemProps {
  item: NavItemLink;
  isChild?: boolean;
  depth?: number;
}

// Helper to check if any descendant link is active (recursive)
function isDescendantActive(children: NavElement[], pathname: string): boolean {
  for (const child of children) {
    if (child.type === "link") {
      if (child.href === pathname) return true;
      if (child.children && isDescendantActive(child.children, pathname)) {
        return true;
      }
    }
  }
  return false;
}

export function NavLinkItem({
  item,
  isChild = false,
  depth = 0,
}: NavLinkItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { searchQuery, expandedItems, toggleItemExpansion } = useNav();
  const { hovered, ref } = useHover<HTMLAnchorElement>();

  // Active State Logic
  const active = item.href ? pathname === item.href : false;
  // Recursive check for parent active state
  const isParentActive = item.children
    ? isDescendantActive(item.children, pathname)
    : false;

  const hasChildren = !!item.children && item.children.length > 0;
  const itemId = item.id || item.label;
  const isExpanded = hasChildren ? expandedItems.includes(itemId) : false;

  // Search Logic
  const matchesSearch =
    !searchQuery ||
    item.label.toLowerCase().includes(searchQuery.toLowerCase());

  if (!matchesSearch && searchQuery && !hasChildren) return null;

  return (
    <NavLink
      ref={ref}
      active={active || isParentActive}
      label={
        searchQuery && matchesSearch ? (
          <Highlight
            highlight={searchQuery}
            size="xs"
            fw={600}
            component="span"
          >
            {item.label}
          </Highlight>
        ) : (
          item.label
        )
      }
      leftSection={
        isChild ? (
          <LineVerticalIcon
            weight="bold"
            color={
              active || hovered ? "var(--mantine-color-brand-6)" : "transparent"
            }
            size={14}
          />
        ) : (
          item.icon && <item.icon weight="fill" size={16} />
        )
      }
      opened={isExpanded}
      onChange={() => hasChildren && toggleItemExpansion(itemId)}
      onClick={(e) => {
        if (!hasChildren && item.href) {
          router.push(item.href);
        }
      }}
      classNames={classesNavLink}
      childrenOffset={0}
      px="xs"
      py={6}
    >
      {/* Render nested children inside NavLink for proper expand/collapse */}
      {hasChildren &&
        item.children!.map((child, index) => {
          if (child.type === "link") {
            return (
              <NavLinkItem
                key={child.id || `${child.label}-${index}`}
                item={child}
                isChild={true}
                depth={depth + 1}
              />
            );
          }
          if (child.type === "divider") {
            const dividerKey = child.id || `divider-${index}`;
            if (child.label) {
              return (
                <div key={dividerKey}>
                  <Divider my={child.margin || "xs"} />
                  <Text
                    fw={900}
                    tt="uppercase"
                    size="10px"
                    c="brand"
                    px="36px"
                    pb="xs"
                  >
                    {child.label}
                  </Text>
                </div>
              );
            }
            return <Divider key={dividerKey} my={child.margin || "xs"} />;
          }
          return null;
        })}
    </NavLink>
  );
}
