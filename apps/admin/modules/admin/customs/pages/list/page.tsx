"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTableWrapper } from "@settle/core";
import { DataTableShell } from "@settle/admin";
import { Button, Group, Stack } from "@mantine/core";
import { PlusIcon } from "@phosphor-icons/react";
import { CUSTOMS_MODULE_CONFIG, CUSTOM_API } from "../../module.config";
import { columns } from "./columns";
import { NewCustomModal } from "../../modals/NewCustomModal";

export function ListPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);

  return (
    <Stack gap="md">
      {/* Custom toolbar with New button that opens modal */}
      <Group justify="space-between">
        <div />
        <Button
          leftSection={<PlusIcon size={16} />}
          onClick={() => {
            setEditRecord(null);
            setModalOpen(true);
          }}
        >
          New Custom Group
        </Button>
      </Group>

      <DataTableWrapper
        queryKey="customs.list"
        enableServerQuery={true}
        queryGetFn={async (params) => {
          return await CUSTOM_API.getRecords(params);
        }}
        dataKey="results"
        paginationDataKey="pagination"
      >
        <DataTableShell
          moduleInfo={CUSTOMS_MODULE_CONFIG}
          columns={columns}
          idAccessor="id"
          hasServerSearch={true}
          onEditClick={(record: any) => {
            setEditRecord(record);
            setModalOpen(true);
          }}
          onDeleteClick={async (ids: any) => {
            const idArray = Array.isArray(ids) ? ids : [ids];
            for (const id of idArray) {
              await CUSTOM_API.deleteRecord(String(id));
            }
          }}
          customActions={(record: any) => [
            {
              label: "Open Docs",
              onClick: () => router.push(`/admin/docs?custom=${record.id}`),
            },
          ]}
        />
      </DataTableWrapper>

      <NewCustomModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditRecord(null);
        }}
        initialData={editRecord}
      />
    </Stack>
  );
}
