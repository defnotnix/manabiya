import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const voterRollEntryFormSchema = z.object({
  phone_number: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  religion: z.string().optional().nullable(),
  address_en: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
});

export const voterRollEntryFormConfig = {
  initial: {
    phone_number: "",
    occupation: "",
    education: "",
    religion: "",
    address_en: "",
    remarks: "",
  },
  steps: 1,
  validation: [zodResolver(voterRollEntryFormSchema)],
};
