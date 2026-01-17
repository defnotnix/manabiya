/**
 * Performs a case-insensitive search across all fields of an array of objects.
 *
 * Searches through every value in each object and returns items that contain
 * the search term in any of their fields. The search is case-insensitive and
 * works with any data type by converting values to strings.
 *
 * @template T - The type of objects in the data array
 * @param {T[]} data - Array of objects to search through
 * @param {string} search - Search term to find (case-insensitive)
 *
 * @returns {T[]} Filtered array containing only items that match the search term
 *
 * @example
 * // Search through user data
 * const users = [
 *   { id: 1, name: "John Doe", email: "john@example.com" },
 *   { id: 2, name: "Jane Smith", email: "jane@example.com" },
 *   { id: 3, name: "Bob Johnson", email: "bob@example.com" }
 * ];
 *
 * const results = autoSearch(users, "john");
 * // Returns: [{ id: 1, name: "John Doe", ... }, { id: 3, name: "Bob Johnson", ... }]
 *
 * @example
 * // Empty or no search term
 * autoSearch(users, "");  // Returns empty array
 * autoSearch([], "test"); // Returns empty array
 *
 * @example
 * // Search works on all field types
 * const products = [
 *   { id: 1, name: "Laptop", price: 999 },
 *   { id: 2, name: "Mouse", price: 25 }
 * ];
 * autoSearch(products, "999");  // Finds laptop by price
 * autoSearch(products, "lap");   // Finds laptop by name
 */
export function autoSearch<T>(data: T[], search: string): T[] {
  // Normalize the search term to lowercase for case-insensitive comparison.
  const normalizedSearchTerm = search.toLowerCase();

  // If the data array is empty or not provided, return an empty array to avoid unnecessary processing.
  if (!data || data.length === 0) return [];

  // Filter the data array to include only items that match the search term.
  return data.filter((item: any) =>
    // Check if any value in the current item contains the search term.
    Object.values(item).some((value) =>
      // Convert each value to a string, make it lowercase, and check if it includes the normalized search term.
      // If the search term is found within any value, `some` returns true, meaning the item will be included in the result.
      String(value).toLowerCase().includes(normalizedSearchTerm)
    )
  );
}
