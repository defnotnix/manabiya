import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const signaturesFormSchema = z.object({
  name: z.string().min(1, "Signature name is required"),
  signature_image: z.any().optional(),
  is_active: z.boolean().default(true),
});

export const signaturesFormConfig = {
  initial: {
    name: "",
    signature_image: null,
    is_active: true,
  },
  steps: 1,
  validation: [zodResolver(signaturesFormSchema)],
  submitFormat: "formdata" as const,
  formatJsonSubmitConfig: {
    keyIgnore: [],
  },
};
