import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const customsFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  is_active: z.boolean().default(true),
});

export const customsFormConfig = {
  initial: {
    name: "",
    description: "",
    is_active: true,
  },
  steps: 1,
  validation: [zodResolver(customsFormSchema)],
};
