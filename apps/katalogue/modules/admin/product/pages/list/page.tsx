"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { PRODUCT_MODULE_CONFIG, PRODUCT_API } from "../../module.config";
import { ProductForm } from "../../form/ProductForm";
import { productFormConfig } from "../../form/form.config";
import { productListColumns } from "./list.columns";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="catalogue.products.list"
      queryGetFn={PRODUCT_API.getProducts}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={PRODUCT_MODULE_CONFIG}
        columns={productListColumns}
        idAccessor="id"
        filterList={[]}
        onCreateApi={async (data) => {
          const res = await PRODUCT_API.createProduct(data);
          if (res.err) throw new Error(res.error || "Failed to create");
          return res.data;
        }}
        onEditApi={async (id, data) => {
          const res = await PRODUCT_API.updateProduct(id, data);
          if (res.err) throw new Error(res.error || "Failed to edit");
          return res.data;
        }}
        onDeleteApi={async (id) => {
          const res = await PRODUCT_API.deleteProduct(id);
          if (res.err) throw new Error(res.error || "Failed to delete");
          return res.data;
        }}
        createFormComponent={<ProductForm />}
        editFormComponent={<ProductForm />}
        createFormConfig={productFormConfig}
        editFormConfig={productFormConfig}
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
