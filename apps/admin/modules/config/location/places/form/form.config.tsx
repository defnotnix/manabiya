import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const placeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  name_en: z.string().optional(),
  place_type: z.string().min(1, "Place Type is required"),
  geo_unit: z.string().min(1, "Geo Unit is required"),
  // Assuming point is handled as an object or separate lat/lng fields in UI but passed as object?
  // User example response: "point": {"lat": 28.0002, "lng": 84.6233}
  // So form should probably handle lat/lng separate and combine on submit or use nested object in schema?
  // FormWrapper uses flat keys usually, but nested works with dot notation in some form libs.
  // I will use flat lat/lng in form and transform in the API handler if needed.
  // Actually, Mantine form supports nested paths.
  point: z
    .object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
});

export const placeFormConfig = {
  initial: {
    name: "",
    name_en: "",
    place_type: "",
    geo_unit: "",
    point: { lat: undefined, lng: undefined },
  },
  steps: 1,
  validation: [zodResolver(placeFormSchema)],
};
