"use client";

import { Anchor, Breadcrumbs, Container, Group, Text } from "@mantine/core";
import { CaretRightIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface AutoBreadcrumbProps {
  hidden?: string[];
}

export function AutoBreadcrumb({ hidden = [] }: AutoBreadcrumbProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (!pathname) return null;

  // Hide breadcrumb if current pathname is in the hidden list
  if (hidden.includes(pathname)) return null;

  // Split pathname and remove empty strings
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  // Base admins path check (assuming /admin is the root for this context)
  // If we are deeper than just /admin (or whatever the root is), we show back button
  // For simplicity, let's assume if length > 1, or if we are not at root.
  // The user said "if utl is anything beyond /admin".
  // So if pathSegments contains "admin" and length > 1 (e.g. admin/foo), or if it doesn't contain admin but is nested.
  // Actually, let's just use the logic: if there are 2 or more segments, show back button.
  // Example: /admin (1 segment) -> No back. /admin/users (2 segments) -> Back.

  const showBackButton = pathSegments.length > 1;

  const items = pathSegments.map((segment, index) => {
    // Construct url for this segment
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

    // Format text: capitalize and replace hyphens
    const title = segment
      .replace(/-/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase());

    const isLast = index === pathSegments.length - 1;

    return isLast ? (
      <Text key={href} size="xs" c="dimmed">
        {title}
      </Text>
    ) : (
      <Anchor component={Link} href={href} key={href} size="xs" fw={800}>
        {title}
      </Anchor>
    );
  });

  const handleBack = () => {
    // We could use router.back(), but sometimes that goes out of the app.
    // Usually explicit "Up" navigation is better, but "Back" usually implies history.
    // Given "auto back button", router.back() is the standard interpretation.
    router.back();
  };

  return (
    <>
      <Container size="xl">
        <Group h={30} gap="xs" align="flex-end">
          {/* {showBackButton && (
            <ActionIcon
              variant="light"
              color="gray"
              size="sm"
              onClick={handleBack}
              aria-label="Go back"
            >
              <ArrowLeftIcon weight="bold" />
            </ActionIcon>
          )} */}
          <Breadcrumbs
            separatorMargin={8}
            separator={<CaretRightIcon size={10} weight="bold" />}
          >
            {items}
          </Breadcrumbs>
        </Group>
      </Container>
    </>
  );
}
