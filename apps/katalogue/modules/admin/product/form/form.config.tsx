import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const productFormSchema = z.object({
  node: z.number().min(1, "Node is required"),
  display_name: z.string().min(1, "Display name is required"),
  base_unit_name: z.string().min(1, "Unit name is required"),
  base_unit_size: z.number().min(0, "Size must be positive"),
  is_active: z.boolean().optional(),
});

export const productFormConfig = {
  initial: {
    node: null,
    display_name: "",
    base_unit_name: "",
    base_unit_size: 1.0,
    is_active: true,
  },
  steps: 1,
  validation: [zodResolver(productFormSchema)],
};
