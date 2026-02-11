"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppShell,
  Group,
  Text,
  Button,
  Loader,
  Center,
  Box,
  Container,
} from "@mantine/core";
import { SignOutIcon, AddressBookIcon } from "@phosphor-icons/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for auth token
    const token = sessionStorage.getItem("kcatoken");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("kcatoken");
    sessionStorage.removeItem("kcrtoken");
    router.replace("/login");
  };

  if (isAuthenticated === null) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container>
          <Group h={60} justify="space-between">
            <Group gap="xs">
              <AddressBookIcon size={28} weight="duotone" />
              <Text fw={600} size="md" c="brand.6 ">
                zetsel.
              </Text>
              <Text fw={600} size="md">
                Contact Directory
              </Text>

            </Group>
            <Button
              variant="subtle"
              color="gray"
              leftSection={<SignOutIcon size={18} />}
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Box maw={1400} mx="auto">
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
