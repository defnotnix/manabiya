import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { STUDENT_API } from "../../students/module.api";

export function useStudentSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchQuery, 500);

  const { data: searchData, isFetching } = useQuery({
    queryKey: ["student-search", debouncedSearch],
    queryFn: () => STUDENT_API.searchStudents(debouncedSearch),
    enabled: debouncedSearch.trim().length > 1,
  });

  const students = searchData?.data ?? [];
  const isSearchActive = searchQuery.trim().length > 0;

  return {
    searchQuery,
    setSearchQuery,
    students,
    isFetching,
    isSearchActive,
  };
}
