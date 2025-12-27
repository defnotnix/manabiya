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
