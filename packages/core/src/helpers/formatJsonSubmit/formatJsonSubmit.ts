import { PropFormatJsonSubmit } from "./formatJsonSumit.type";

/**
 * Formats and transforms data for JSON or FormData submission to an API.
 *
 * This helper function processes form data by:
 * - Filtering out ignored keys
 * - Performing dirty checking to only include changed values
 * - Stringifying specified fields
 * - Converting to FormData format if required (for file uploads)
 *
 * @param {PropFormatJsonSubmit} options - Configuration options for data formatting
 * @param {Record<string, any>} options.data - The raw form data to be formatted
 * @param {string[]} options.keyIgnore - Array of keys to exclude from submission
 * @param {string[]} options.stringify - Array of keys whose values should be JSON.stringify'd
 * @param {Record<string, any>} options.dirtCheckValues - Original values for dirty checking (only changed fields will be included)
 * @param {boolean} options.formatToFormData - If true, returns FormData instead of plain object
 *
 * @returns {Promise<Record<string, any> | FormData>} Formatted data ready for API submission
 *
 * @example
 * // Basic usage - filter and format data
 * const formattedData = await formatJsonSubmit({
 *   data: { name: "John", email: "john@example.com", _id: "123" },
 *   keyIgnore: ["_id"],  // Remove internal fields
 * });
 * // Result: { name: "John", email: "john@example.com" }
 *
 * @example
 * // Dirty checking - only submit changed values
 * const formattedData = await formatJsonSubmit({
 *   data: { name: "Jane", email: "john@example.com", age: 25 },
 *   dirtCheckValues: { name: "John", email: "john@example.com", age: 25 },
 * });
 * // Result: { name: "Jane" } - only changed field
 *
 * @example
 * // Stringify complex objects
 * const formattedData = await formatJsonSubmit({
 *   data: {
 *     name: "John",
 *     preferences: { theme: "dark", language: "en" }
 *   },
 *   stringify: ["preferences"],
 * });
 * // Result: { name: "John", preferences: '{"theme":"dark","language":"en"}' }
 *
 * @example
 * // Convert to FormData for file uploads
 * const formData = await formatJsonSubmit({
 *   data: { name: "John", avatar: fileObject },
 *   formatToFormData: true,
 * });
 * // Result: FormData with name and avatar fields
 */
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
    console.log("[formatJsonSubmit] Converting to FormData with entries:", Array.from(formData.entries()));
    return formData;
  } else {
    return _dataFormatted;
  }
}
