import { PropFormatJsonSubmit } from "./formatJsonSumit.type";

export async function formatJsonSubmit({
  data = [],
  keyIgnore = [],
  stringify = [],
  dirtCheckValues = {},
  formatToFormData = false,
}: PropFormatJsonSubmit) {
  const _dataFormatted: Record<string, any> = {};

  for (const key in data) {
    if (keyIgnore.includes(key)) continue; // Ignore specified keys

    const value = data[key];

    // Skip field if it exists in dirtCheckValues and hasn't changed
    if (
      dirtCheckValues.hasOwnProperty(key) &&
      JSON.stringify(dirtCheckValues[key]) === JSON.stringify(value)
    ) {
      continue;
    }

    _dataFormatted[key] = stringify.includes(key)
      ? JSON.stringify(value)
      : value;
  }

  // Convert to FormData if required
  if (formatToFormData) {
    const formData = new FormData();
    Object.entries(_dataFormatted).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  } else {
    return _dataFormatted;
  }
}
