import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const signaturesFormSchema = z.object({
  name: z.string().min(1, "Signature name is required"),
  role: z.string().min(1, "Role is required"),
  jp_role: z.string().optional(),
  signature_image: z.any().optional(),
});

export const signaturesFormConfig = {
  initial: {
    id: "",
    name: "",
    role: "",
    jp_role: "",
    signature_image: null,
    is_active: true,
  },
  steps: 1,
  validation: [zodResolver(signaturesFormSchema)],
  submitFormat: "formdata" as const,
};
