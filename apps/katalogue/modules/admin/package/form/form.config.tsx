import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

const componentSchema = z.object({
  component_type: z.enum(["BASE_UNIT", "PACKAGE"], {
    required_error: "Component type is required",
  }),
  quantity: z.number().min(0.01, "Quantity must be positive"),
  component_package: z.string().optional().nullable(),
});

export const packageFormSchema = z.object({
  product: z.string().min(1, "Product is required"),
  package_name: z.string().min(1, "Package name is required"),
  base_units_total: z.number().min(0, "Total units must be positive"),
  is_active: z.boolean().optional(),
  components: z.array(componentSchema).optional(),
});

export const packageFormConfig = {
  initial: {
    product: "",
    package_name: "",
    base_units_total: 1.0,
    is_active: true,
    components: [],
  },
  steps: 1,
  validation: [zodResolver(packageFormSchema)],
};
