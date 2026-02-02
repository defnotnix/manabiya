"use client";

import { DataTableShell, AutoBreadcrumb } from "@settle/admin";
import { DataTableWrapper } from "@settle/core";

export default function TestLayoutPage() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 16 }}>
        <AutoBreadcrumb />
      </div>
      <DataTableWrapper
        queryKey="test.list"
        queryGetFn={async () => {
          return {
            data: Array.from({ length: 50 }).map((_, i) => ({
              id: i,
              firstName: `User ${i}`,
              lastName: `Test`,
              email: `user${i}@example.com`,
            })),
          };
        }}
        dataKey="results"
      >
        <DataTableShell
          moduleInfo={{
            name: "Test Users",
            term: "User",
          }}
          idAccessor="id"
          columns={[
            { accessor: "id", title: "ID" },
            { accessor: "firstName", title: "First Name" },
            { accessor: "lastName", title: "Last Name" },
            { accessor: "email", title: "Email" },
          ]}
          filterList={[]}
        />
      </DataTableWrapper>
    </div>
  );
}
