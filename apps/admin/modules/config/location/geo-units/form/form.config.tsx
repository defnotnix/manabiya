import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const geoUnitFormSchema = z.object({
  display_name: z.string().min(1, "Display Name is required"),
  unit_type: z.string().min(1, "Unit Type is required"), // Store ID as string
  parent: z.string().optional().nullable(),
  official_code: z.string().optional().nullable(),
  ward_no: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().optional().nullable(),
  ),
});

export const geoUnitFormConfig = {
  initial: {
    display_name: "",
    unit_type: "",
    parent: null,
    official_code: "",
    ward_no: null,
  },
  steps: 1,
  validation: [zodResolver(geoUnitFormSchema)],
};
