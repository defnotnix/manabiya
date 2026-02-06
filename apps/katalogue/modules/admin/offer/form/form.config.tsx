import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const offerFormSchema = z.object({
  package: z.string().min(1, "Package is required"),
  price: z.number().min(0, "Price must be positive"),
  currency: z.string().min(1, "Currency is required"),
  is_available: z.boolean().optional(),
});

export const offerFormConfig = {
  initial: {
    package: "",
    price: 0,
    currency: "NPR",
    is_available: true,
  },
  steps: 1,
  validation: [zodResolver(offerFormSchema)],
};
