"use client";

import { useRouter } from "next/navigation";
import { Button, Group } from "@mantine/core";
import { BookOpenIcon } from "@phosphor-icons/react";
import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { CUSTOMS_MODULE_CONFIG, CUSTOMS_API } from "../../module.config";
import { CustomsForm } from "../../form/CustomsForm";
import { customsFormConfig } from "../../form/form.config";
import { customsListColumns } from "./list.columns";

export function ListPage() {
  const router = useRouter();

  // Add cell renderer to documents column
  const columnsWithActions = customsListColumns.map((col: any) => {
    if (col.accessor === "documents") {
      return {
        ...col,
        render: (record: any) => (
          <Group gap="xs">
            <Button
              variant="subtle"
              size="xs"
              leftSection={<BookOpenIcon size={16} />}
              onClick={() => router.push(`/admin/docs?custom_id=${record.id}`)}
            >
              Review
            </Button>
          </Group>
        ),
      };
    }
    return col;
  });

  // Handle custom document creation - redirect to docs page
  const handleCreateSuccess = (response: any) => {
    if (response?.id) {
      router.push(`/admin/docs?custom=${response.id}`);
    }
  };

  return (
    <DataTableWrapper
      queryKey="customs.list"
      queryGetFn={async () => CUSTOMS_API.getCustoms()}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={CUSTOMS_MODULE_CONFIG}
        columns={columnsWithActions}
        idAccessor="id"
        filterList={[]}
        onCreateApi={async (data) => {
          const response = await CUSTOMS_API.createCustom(data);
          handleCreateSuccess(response);
          return response;
        }}
        onEditApi={async (id, data) => CUSTOMS_API.updateCustom(String(id), data)}
        onDeleteApi={async (id) => CUSTOMS_API.deleteCustom(String(id))}
        createFormComponent={<CustomsForm />}
        editFormComponent={<CustomsForm />}
        createFormConfig={customsFormConfig}
        editFormConfig={customsFormConfig}
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
