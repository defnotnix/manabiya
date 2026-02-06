"use client";

import { useRouter } from "next/navigation";
import { DataTableWrapper } from "@settle/core";
import { DataTableShell } from "@settle/admin";
import { DEALER_API, DEALER_MODULE_CONFIG } from "../../module.config";
import { columns } from "./columns";

export function ListPage() {
  const router = useRouter();

  return (
    <DataTableWrapper
      queryKey="dealer.list"
      queryGetFn={DEALER_API.getDealers}
      dataKey="results"
    >
      <DataTableShell
        moduleInfo={DEALER_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        newButtonHref="/dealer/dealer/new"
        onEditClick={(id) => {
          router.push(`/dealer/dealer/${id}/edit`);
        }}
        onDeleteClick={async (ids) => {
          const idArray = Array.isArray(ids) ? ids : [ids];
          for (const id of idArray) {
            await DEALER_API.deleteDealer(String(id));
          }
        }}
        filterList={[]}
      />
    </DataTableWrapper>
  );
}
