"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { PACKAGE_MODULE_CONFIG, PACKAGE_API } from "../../module.config";
import { PackageForm } from "../../form/PackageForm";
import { packageFormConfig } from "../../form/form.config";
import { packageListColumns } from "./list.columns";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="catalogue.packages.list"
      queryGetFn={PACKAGE_API.getPackages}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={PACKAGE_MODULE_CONFIG}
        columns={packageListColumns}
        idAccessor="id"
        filterList={[]}
        onCreateApi={async (data) => {
          const res = await PACKAGE_API.createPackage(data);
          if (res.err) throw new Error(res.error || "Failed to create");
          return res.data;
        }}
        onEditApi={async (id, data) => {
          const res = await PACKAGE_API.updatePackage(id, data);
          if (res.err) throw new Error(res.error || "Failed to edit");
          return res.data;
        }}
        onDeleteApi={async (id) => {
          const res = await PACKAGE_API.deletePackage(id);
          if (res.err) throw new Error(res.error || "Failed to delete");
          return res.data;
        }}
        createFormComponent={<PackageForm />}
        editFormComponent={<PackageForm />}
        createFormConfig={packageFormConfig}
        editFormConfig={packageFormConfig}
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
