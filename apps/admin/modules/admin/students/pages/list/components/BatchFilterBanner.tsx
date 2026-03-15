"use client";

import { Group, Button, Text, Container, Paper, Menu, Loader } from "@mantine/core";
import { useRouter } from "next/navigation";
import { XIcon, CaretDownIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { BATCH_API } from "../../../module.api";

interface BatchFilterBannerProps {
  batchName: string | null;
}

export function BatchFilterBanner({ batchName }: BatchFilterBannerProps) {
  const router = useRouter();
  const { data: batches = [], isLoading } = useQuery({
    queryKey: ["batches"],
    queryFn: async () => {
      const result = await BATCH_API.getBatches();
      const batchList = result?.data || [];
      return Array.isArray(batchList) ? batchList : [];
    },
  });

  if (!batchName) return null;

  return (
    <Paper bg="brand.0">
      <Container size="xl">
        <Group gap="xs" justify="space-between">
          <Group gap="xs">
            <Text size="sm">Viewing Batch:</Text>
            <Menu position="bottom-start">
              <Menu.Target>
                <Button
                  variant="subtle"
                  size="xs"
                  rightSection={isLoading ? <Loader size="xs" /> : <CaretDownIcon size={14} />}
                >
                  {batchName}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {batches.map((batch: any) => (
                  <Menu.Item
                    key={batch.id}
                    onClick={() =>
                      router.push(
                        `/admin/students?batch=${batch.id}&batch_name=${encodeURIComponent(batch.name)}`
                      )
                    }
                  >
                    {batch.name}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Button
            variant="subtle"
            size="xs"
            color="red"
            leftSection={<XIcon size={14} />}
            onClick={() => router.push("/admin/students")}
          >
            Clear
          </Button>
        </Group>
      </Container>
    </Paper>
  );
}
