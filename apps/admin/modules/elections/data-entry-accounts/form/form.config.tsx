import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const dataEntryAccountFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  polling_stations: z
    .array(z.string())
    .min(1, "At least one Polling Station is required"),
});

export const dataEntryAccountFormConfig = {
  initial: {
    name: "",
    username: "",
    password: "",
    polling_stations: [],
  },
  steps: 1,
  validation: [zodResolver(dataEntryAccountFormSchema)],
};
