import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const placeTypeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const placeTypeFormConfig = {
  initial: {
    name: "",
  },
  steps: 1,
  validation: [zodResolver(placeTypeFormSchema)],
};
