import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const UserFormSchema = z.object({
  userType: z.string().optional(),
  name: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  is_active: z.boolean().optional(),
  is_disabled: z.boolean().optional(),
  is_staff: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
  groups: z.array(z.string()).optional(),
  user_permissions: z.array(z.string()).optional(),
  polling_stations: z.array(z.string()).optional(),
});

export const UserFormConfig = {
  steps: 1,
  initial: {
    userType: "",
    name: "",
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    is_active: true,
    is_disabled: false,
    is_staff: false,
    is_superuser: false,
    groups: [] as string[],
    user_permissions: [] as string[],
    polling_stations: [] as string[],
  },
  validation: [zodResolver(UserFormSchema)],
};
