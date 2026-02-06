import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const geoUnitTypeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const geoUnitTypeFormConfig = {
  initial: {
    name: "",
  },
  steps: 1,
  validation: [zodResolver(geoUnitTypeFormSchema)],
};
